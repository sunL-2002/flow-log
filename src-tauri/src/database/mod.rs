pub mod schema;
pub mod activity;
pub mod rules;
pub mod settings;

use rusqlite::{Connection, Result as SqliteResult};
use std::path::PathBuf;
use std::fs;

pub struct Database {
    conn: Connection,
}

impl Database {
    pub fn new() -> SqliteResult<Self> {
        let db_path = Self::get_db_path();
        
        if let Some(parent) = db_path.parent() {
            fs::create_dir_all(parent).ok();
        }
        
        let conn = Connection::open(&db_path)?;
        
        let db = Database { conn };
        db.initialize()?;
        
        Ok(db)
    }
    
    fn get_db_path() -> PathBuf {
        let app_data = std::env::var("APPDATA")
            .or_else(|_| std::env::var("HOME"))
            .unwrap_or_else(|_| ".".to_string());
        
        PathBuf::from(app_data)
            .join("FlowLog")
            .join("data.db")
    }
    
    fn initialize(&self) -> SqliteResult<()> {
        self.conn.execute_batch(&format!(
            "{} {} {}",
            schema::CREATE_ACTIVITIES_TABLE,
            schema::CREATE_RULES_TABLE,
            schema::CREATE_SETTINGS_TABLE,
        ))?;
        
        self.insert_default_rules()?;
        self.insert_default_settings()?;
        
        Ok(())
    }
    
    fn insert_default_rules(&self) -> SqliteResult<()> {
        let default_rules = [
            ("VS Code,Visual Studio,IDEA,IntelliJ,WebStorm,PyCharm,GoLand,CLion,Atom,Sublime", "coding", 100),
            ("腾讯会议,Zoom,Teams,钉钉会议,飞书会议,Webex", "meeting", 100),
            ("钉钉,微信,Slack,Telegram,QQ,飞书,Discord", "communication", 80),
            ("Chrome,Edge,Firefox,Safari", "unknown", 50),
            ("Figma,Sketch,XD,Photoshop,Illustrator", "design", 90),
        ];
        
        for (keywords, activity_type, confidence) in default_rules.iter() {
            self.conn.execute(
                "INSERT OR IGNORE INTO recognition_rules (keywords, activity_type, confidence, is_default) VALUES (?1, ?2, ?3, 1)",
                [keywords, activity_type, &confidence.to_string()],
            ).ok();
        }
        
        Ok(())
    }
    
    fn insert_default_settings(&self) -> SqliteResult<()> {
        self.conn.execute(
            "INSERT OR IGNORE INTO settings (key, value) VALUES 
            ('auto_start', 'true'),
            ('minimize_to_tray', 'true'),
            ('show_daily_notification', 'true'),
            ('show_focus_reminder', 'false'),
            ('show_weekly_reminder', 'true'),
            ('theme', 'light'),
            ('language', 'zh-CN'),
            ('work_start_time', '09:00'),
            ('work_end_time', '18:00'),
            ('poll_interval_ms', '1000'),
            ('first_launch', 'true')",
            [],
        ).ok();
        
        Ok(())
    }
    
    pub fn get_connection(&self) -> &Connection {
        &self.conn
    }
}
