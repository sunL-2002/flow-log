use rusqlite::{params, Row};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RecognitionRule {
    pub id: i64,
    pub keywords: String,
    pub activity_type: String,
    pub confidence: i32,
    pub is_default: bool,
    pub is_enabled: bool,
}

impl RecognitionRule {
    pub fn from_row(row: &Row) -> rusqlite::Result<Self> {
        Ok(RecognitionRule {
            id: row.get(0)?,
            keywords: row.get(1)?,
            activity_type: row.get(2)?,
            confidence: row.get(3)?,
            is_default: row.get::<_, i32>(4)? != 0,
            is_enabled: row.get::<_, i32>(5)? != 0,
        })
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NewRule {
    pub keywords: String,
    pub activity_type: String,
    pub confidence: Option<i32>,
}

impl Database {
    pub fn get_all_rules(&self) -> rusqlite::Result<Vec<RecognitionRule>> {
        let conn = self.get_connection();
        
        let mut stmt = conn.prepare(
            "SELECT id, keywords, activity_type, confidence, is_default, is_enabled
             FROM recognition_rules
             WHERE is_enabled = 1
             ORDER BY is_default DESC, confidence DESC"
        )?;
        
        let rules = stmt.query_map([], RecognitionRule::from_row)?
            .filter_map(|r| r.ok())
            .collect();
        
        Ok(rules)
    }
    
    pub fn add_rule(&self, rule: &NewRule) -> rusqlite::Result<i64> {
        let conn = self.get_connection();
        let confidence = rule.confidence.unwrap_or(80);
        
        conn.execute(
            "INSERT INTO recognition_rules (keywords, activity_type, confidence, is_default, is_enabled)
             VALUES (?1, ?2, ?3, 0, 1)",
            params![rule.keywords, rule.activity_type, confidence],
        )?;
        
        Ok(conn.last_insert_rowid())
    }
    
    pub fn update_rule(&self, id: i64, keywords: &str, activity_type: &str, confidence: i32) -> rusqlite::Result<()> {
        let conn = self.get_connection();
        
        conn.execute(
            "UPDATE recognition_rules SET keywords = ?1, activity_type = ?2, confidence = ?3 WHERE id = ?4",
            params![keywords, activity_type, confidence, id],
        )?;
        
        Ok(())
    }
    
    pub fn delete_rule(&self, id: i64) -> rusqlite::Result<()> {
        let conn = self.get_connection();
        conn.execute("DELETE FROM recognition_rules WHERE id = ?1 AND is_default = 0", params![id])?;
        Ok(())
    }
    
    pub fn toggle_rule(&self, id: i64, enabled: bool) -> rusqlite::Result<()> {
        let conn = self.get_connection();
        conn.execute(
            "UPDATE recognition_rules SET is_enabled = ?1 WHERE id = ?2",
            params![enabled as i32, id],
        )?;
        Ok(())
    }
}

use crate::database::Database;
