use std::sync::Arc;
use std::time::{Duration, Instant};
use parking_lot::Mutex;
use tauri::AppHandle;
use chrono::{DateTime, Utc};
use crate::database::{Database, activity::NewActivity};
use crate::recognizer::ActivityRecognizer;
use crate::monitor::windows::{get_active_window, is_idle, WindowInfo};

pub struct WindowMonitor {
    db: Arc<Mutex<Database>>,
    recognizer: Arc<Mutex<ActivityRecognizer>>,
    is_tracking: Arc<Mutex<bool>>,
    app_handle: AppHandle,
    last_window: Option<WindowInfo>,
    last_activity_start: Option<DateTime<Utc>>,
    last_activity_type: Option<String>,
    poll_interval: Duration,
}

impl WindowMonitor {
    pub fn new(
        db: Arc<Mutex<Database>>,
        recognizer: Arc<Mutex<ActivityRecognizer>>,
        is_tracking: Arc<Mutex<bool>>,
        app_handle: AppHandle,
    ) -> Self {
        WindowMonitor {
            db,
            recognizer,
            is_tracking,
            app_handle,
            last_window: None,
            last_activity_start: None,
            last_activity_type: None,
            poll_interval: Duration::from_millis(1000),
        }
    }
    
    pub fn start(&mut self) {
        loop {
            if *self.is_tracking.lock() {
                self.tick();
            }
            
            std::thread::sleep(self.poll_interval);
        }
    }
    
    fn tick(&mut self) {
        if is_idle() {
            self.handle_idle();
            return;
        }
        
        match get_active_window() {
            Some(window) => {
                self.handle_window_change(window);
            }
            None => {
                self.handle_idle();
            }
        }
    }
    
    fn handle_window_change(&mut self, window: WindowInfo) {
        let window_changed = self.last_window.as_ref()
            .map(|w| w.title != window.title || w.process_name != window.process_name)
            .unwrap_or(true);
        
        if window_changed {
            self.save_current_activity();
            
            let (activity_type, confidence) = self.recognizer.lock().recognize(&window.title);
            
            self.last_window = Some(window);
            self.last_activity_start = Some(Utc::now());
            self.last_activity_type = Some(activity_type);
            
            let _ = self.emit_status(&activity_type, confidence);
        }
    }
    
    fn handle_idle(&mut self) {
        self.save_current_activity();
        
        self.last_window = None;
        self.last_activity_start = None;
        self.last_activity_type = None;
        
        let _ = self.emit_status("idle", 100);
    }
    
    fn save_current_activity(&mut self) {
        if let (Some(start), Some(window), Some(activity_type)) = (
            self.last_activity_start,
            self.last_window.as_ref(),
            self.last_activity_type.as_ref(),
        ) {
            let end = Utc::now();
            let duration = (end - start).num_seconds();
            
            if duration >= 30 {
                let (activity_type, confidence) = self.recognizer.lock().recognize(&window.title);
                
                let activity = NewActivity {
                    start_time: start.to_rfc3339(),
                    end_time: end.to_rfc3339(),
                    duration_seconds: duration,
                    window_title: window.title.clone(),
                    activity_type,
                    description: None,
                    confidence,
                };
                
                if let Ok(db) = self.db.try_lock() {
                    let _ = db.insert_activity(&activity);
                }
            }
        }
    }
    
    fn emit_status(&self, activity_type: &str, confidence: i32) -> Result<(), tauri::Error> {
        use tauri::Emitter;
        
        self.app_handle.emit("tracking-status", serde_json::json!({
            "activity_type": activity_type,
            "confidence": confidence,
            "timestamp": Utc::now().to_rfc3339(),
        }))
    }
}

impl Drop for WindowMonitor {
    fn drop(&mut self) {
        self.save_current_activity();
    }
}
