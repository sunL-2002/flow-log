use rusqlite::{params, Row};
use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc, NaiveDateTime};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Activity {
    pub id: i64,
    pub start_time: String,
    pub end_time: String,
    pub duration_seconds: i64,
    pub window_title: String,
    pub activity_type: String,
    pub description: Option<String>,
    pub confidence: i32,
    pub is_edited: bool,
}

impl Activity {
    pub fn from_row(row: &Row) -> rusqlite::Result<Self> {
        Ok(Activity {
            id: row.get(0)?,
            start_time: row.get(1)?,
            end_time: row.get(2)?,
            duration_seconds: row.get(3)?,
            window_title: row.get(4)?,
            activity_type: row.get(5)?,
            description: row.get(6)?,
            confidence: row.get(7)?,
            is_edited: row.get::<_, i32>(8)? != 0,
        })
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NewActivity {
    pub start_time: String,
    pub end_time: String,
    pub duration_seconds: i64,
    pub window_title: String,
    pub activity_type: String,
    pub description: Option<String>,
    pub confidence: i32,
}

impl Database {
    pub fn insert_activity(&self, activity: &NewActivity) -> rusqlite::Result<i64> {
        let conn = self.get_connection();
        let now = Utc::now().to_rfc3339();
        
        conn.execute(
            "INSERT INTO activities (start_time, end_time, duration_seconds, window_title, activity_type, description, confidence, is_edited, created_at, updated_at)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, 0, ?8, ?8)",
            params![
                activity.start_time,
                activity.end_time,
                activity.duration_seconds,
                activity.window_title,
                activity.activity_type,
                activity.description,
                activity.confidence,
                now,
            ],
        )?;
        
        Ok(conn.last_insert_rowid())
    }
    
    pub fn get_activities_by_date(&self, date: &str) -> rusqlite::Result<Vec<Activity>> {
        let conn = self.get_connection();
        let start = format!("{}T00:00:00Z", date);
        let end = format!("{}T23:59:59Z", date);
        
        let mut stmt = conn.prepare(
            "SELECT id, start_time, end_time, duration_seconds, window_title, activity_type, description, confidence, is_edited
             FROM activities
             WHERE start_time >= ?1 AND start_time <= ?2
             ORDER BY start_time ASC"
        )?;
        
        let activities = stmt.query_map(params![start, end], Activity::from_row)?
            .filter_map(|a| a.ok())
            .collect();
        
        Ok(activities)
    }
    
    pub fn get_activities_by_date_range(&self, start_date: &str, end_date: &str) -> rusqlite::Result<Vec<Activity>> {
        let conn = self.get_connection();
        let start = format!("{}T00:00:00Z", start_date);
        let end = format!("{}T23:59:59Z", end_date);
        
        let mut stmt = conn.prepare(
            "SELECT id, start_time, end_time, duration_seconds, window_title, activity_type, description, confidence, is_edited
             FROM activities
             WHERE start_time >= ?1 AND start_time <= ?2
             ORDER BY start_time ASC"
        )?;
        
        let activities = stmt.query_map(params![start, end], Activity::from_row)?
            .filter_map(|a| a.ok())
            .collect();
        
        Ok(activities)
    }
    
    pub fn update_activity(&self, id: i64, activity_type: &str, description: Option<&str>) -> rusqlite::Result<()> {
        let conn = self.get_connection();
        let now = Utc::now().to_rfc3339();
        
        conn.execute(
            "UPDATE activities SET activity_type = ?1, description = ?2, is_edited = 1, updated_at = ?3 WHERE id = ?4",
            params![activity_type, description, now, id],
        )?;
        
        Ok(())
    }
    
    pub fn delete_activity(&self, id: i64) -> rusqlite::Result<()> {
        let conn = self.get_connection();
        conn.execute("DELETE FROM activities WHERE id = ?1", params![id])?;
        Ok(())
    }
    
    pub fn get_last_activity(&self) -> rusqlite::Result<Option<Activity>> {
        let conn = self.get_connection();
        
        let mut stmt = conn.prepare(
            "SELECT id, start_time, end_time, duration_seconds, window_title, activity_type, description, confidence, is_edited
             FROM activities
             ORDER BY end_time DESC
             LIMIT 1"
        )?;
        
        let mut activities = stmt.query_map([], Activity::from_row)?
            .filter_map(|a| a.ok())
            .collect::<Vec<_>>();
        
        Ok(activities.pop())
    }
    
    pub fn get_daily_stats(&self, date: &str) -> rusqlite::Result<serde_json::Value> {
        let activities = self.get_activities_by_date(date)?;
        
        let mut stats: std::collections::HashMap<String, i64> = std::collections::HashMap::new();
        let mut total_seconds: i64 = 0;
        
        for activity in &activities {
            *stats.entry(activity.activity_type.clone()).or_insert(0) += activity.duration_seconds;
            total_seconds += activity.duration_seconds;
        }
        
        Ok(serde_json::json!({
            "date": date,
            "total_seconds": total_seconds,
            "breakdown": stats,
            "activity_count": activities.len(),
        }))
    }
    
    pub fn get_weekly_stats(&self, start_date: &str, end_date: &str) -> rusqlite::Result<serde_json::Value> {
        let activities = self.get_activities_by_date_range(start_date, end_date)?;
        
        let mut daily_stats: std::collections::HashMap<String, i64> = std::collections::HashMap::new();
        let mut type_stats: std::collections::HashMap<String, i64> = std::collections::HashMap::new();
        let mut total_seconds: i64 = 0;
        
        for activity in &activities {
            let date = activity.start_time.split('T').next().unwrap_or("");
            *daily_stats.entry(date.to_string()).or_insert(0) += activity.duration_seconds;
            *type_stats.entry(activity.activity_type.clone()).or_insert(0) += activity.duration_seconds;
            total_seconds += activity.duration_seconds;
        }
        
        Ok(serde_json::json!({
            "start_date": start_date,
            "end_date": end_date,
            "total_seconds": total_seconds,
            "daily_breakdown": daily_stats,
            "type_breakdown": type_stats,
            "activity_count": activities.len(),
        }))
    }
}

use crate::database::Database;
