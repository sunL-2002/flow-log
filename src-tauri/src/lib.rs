pub mod commands;
pub mod database;
pub mod monitor;
pub mod recognizer;
pub mod tray;
pub mod utils;

use tauri::Manager;
use std::sync::Arc;
use parking_lot::Mutex;
use crate::database::Database;
use crate::monitor::WindowMonitor;
use crate::recognizer::ActivityRecognizer;

pub struct AppState {
    pub db: Arc<Mutex<Database>>,
    pub monitor: Arc<Mutex<Option<WindowMonitor>>>,
    pub recognizer: Arc<Mutex<ActivityRecognizer>>,
    pub is_tracking: Arc<Mutex<bool>>,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let db = match Database::new() {
        Ok(db) => Arc::new(Mutex::new(db)),
        Err(e) => {
            eprintln!("Failed to initialize database: {}", e);
            std::process::exit(1);
        }
    };

    let recognizer = Arc::new(Mutex::new(ActivityRecognizer::new()));
    let monitor = Arc::new(Mutex::new(None));
    let is_tracking = Arc::new(Mutex::new(false));

    let state = AppState {
        db,
        monitor,
        recognizer,
        is_tracking,
    };

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_notification::init())
        .manage(state)
        .setup(|app| {
            let handle = app.handle();
            
            tray::setup_tray(handle)?;
            
            let state: tauri::State<AppState> = app.state();
            let is_tracking_clone = state.is_tracking.clone();
            *is_tracking_clone.lock() = true;
            
            let monitor_handle = handle.clone();
            let db_clone = state.db.clone();
            let recognizer_clone = state.recognizer.clone();
            let is_tracking_clone = state.is_tracking.clone();
            
            std::thread::spawn(move || {
                let mut monitor_instance = WindowMonitor::new(
                    db_clone,
                    recognizer_clone,
                    is_tracking_clone,
                    monitor_handle,
                );
                monitor_instance.start();
                if let Ok(mut m) = state.monitor.lock() {
                    *m = Some(monitor_instance);
                }
            });
            
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::get_activities,
            commands::get_daily_stats,
            commands::get_weekly_stats,
            commands::update_activity,
            commands::delete_activity,
            commands::get_rules,
            commands::add_rule,
            commands::update_rule,
            commands::delete_rule,
            commands::get_settings,
            commands::update_settings,
            commands::toggle_tracking,
            commands::get_tracking_status,
            commands::generate_weekly_report,
            commands::export_data,
            commands::clear_all_data,
            commands::is_first_launch,
            commands::set_first_launch_complete,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
