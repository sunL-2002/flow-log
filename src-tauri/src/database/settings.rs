use rusqlite::params;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppSettings {
    pub auto_start: bool,
    pub minimize_to_tray: bool,
    pub show_daily_notification: bool,
    pub show_focus_reminder: bool,
    pub show_weekly_reminder: bool,
    pub theme: String,
    pub language: String,
    pub work_start_time: String,
    pub work_end_time: String,
    pub poll_interval_ms: u32,
    pub first_launch: bool,
}

impl Default for AppSettings {
    fn default() -> Self {
        AppSettings {
            auto_start: true,
            minimize_to_tray: true,
            show_daily_notification: true,
            show_focus_reminder: false,
            show_weekly_reminder: true,
            theme: "light".to_string(),
            language: "zh-CN".to_string(),
            work_start_time: "09:00".to_string(),
            work_end_time: "18:00".to_string(),
            poll_interval_ms: 1000,
            first_launch: true,
        }
    }
}

impl Database {
    pub fn get_all_settings(&self) -> rusqlite::Result<HashMap<String, String>> {
        let conn = self.get_connection();
        
        let mut stmt = conn.prepare("SELECT key, value FROM settings")?;
        let settings = stmt.query_map([], |row| Ok((row.get(0)?, row.get(1)?)))?
            .filter_map(|s| s.ok())
            .collect();
        
        Ok(settings)
    }
    
    pub fn get_settings(&self) -> rusqlite::Result<AppSettings> {
        let raw = self.get_all_settings()?;
        
        let parse_bool = |key: &str, default: bool| -> bool {
            raw.get(key).map(|v| v == "true").unwrap_or(default)
        };
        
        let parse_string = |key: &str, default: &str| -> String {
            raw.get(key).cloned().unwrap_or_else(|| default.to_string())
        };
        
        let parse_u32 = |key: &str, default: u32| -> u32 {
            raw.get(key)
                .and_then(|v| v.parse().ok())
                .unwrap_or(default)
        };
        
        Ok(AppSettings {
            auto_start: parse_bool("auto_start", true),
            minimize_to_tray: parse_bool("minimize_to_tray", true),
            show_daily_notification: parse_bool("show_daily_notification", true),
            show_focus_reminder: parse_bool("show_focus_reminder", false),
            show_weekly_reminder: parse_bool("show_weekly_reminder", true),
            theme: parse_string("theme", "light"),
            language: parse_string("language", "zh-CN"),
            work_start_time: parse_string("work_start_time", "09:00"),
            work_end_time: parse_string("work_end_time", "18:00"),
            poll_interval_ms: parse_u32("poll_interval_ms", 1000),
            first_launch: parse_bool("first_launch", true),
        })
    }
    
    pub fn update_setting(&self, key: &str, value: &str) -> rusqlite::Result<()> {
        let conn = self.get_connection();
        conn.execute(
            "INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?1, ?2, datetime('now'))",
            params![key, value],
        )?;
        Ok(())
    }
    
    pub fn update_settings(&self, settings: &AppSettings) -> rusqlite::Result<()> {
        self.update_setting("auto_start", &settings.auto_start.to_string())?;
        self.update_setting("minimize_to_tray", &settings.minimize_to_tray.to_string())?;
        self.update_setting("show_daily_notification", &settings.show_daily_notification.to_string())?;
        self.update_setting("show_focus_reminder", &settings.show_focus_reminder.to_string())?;
        self.update_setting("show_weekly_reminder", &settings.show_weekly_reminder.to_string())?;
        self.update_setting("theme", &settings.theme)?;
        self.update_setting("language", &settings.language)?;
        self.update_setting("work_start_time", &settings.work_start_time)?;
        self.update_setting("work_end_time", &settings.work_end_time)?;
        self.update_setting("poll_interval_ms", &settings.poll_interval_ms.to_string())?;
        self.update_setting("first_launch", &settings.first_launch.to_string())?;
        Ok(())
    }
    
    pub fn is_first_launch(&self) -> rusqlite::Result<bool> {
        let settings = self.get_settings()?;
        Ok(settings.first_launch)
    }
    
    pub fn set_first_launch_complete(&self) -> rusqlite::Result<()> {
        self.update_setting("first_launch", "false")
    }
}

use crate::database::Database;
