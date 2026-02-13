use tauri::State;
use crate::AppState;
use crate::database::activity::{Activity, NewActivity};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct ActivityUpdate {
    pub id: i64,
    pub activity_type: String,
    pub description: Option<String>,
}

#[tauri::command]
pub fn get_activities(state: State<AppState>, date: String) -> Result<Vec<Activity>, String> {
    let db = state.db.lock();
    db.get_activities_by_date(&date)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_daily_stats(state: State<AppState>, date: String) -> Result<serde_json::Value, String> {
    let db = state.db.lock();
    db.get_daily_stats(&date)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_weekly_stats(state: State<AppState>, start_date: String, end_date: String) -> Result<serde_json::Value, String> {
    let db = state.db.lock();
    db.get_weekly_stats(&start_date, &end_date)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn update_activity(state: State<AppState>, id: i64, activity_type: String, description: Option<String>) -> Result<(), String> {
    let db = state.db.lock();
    db.update_activity(id, &activity_type, description.as_deref())
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn delete_activity(state: State<AppState>, id: i64) -> Result<(), String> {
    let db = state.db.lock();
    db.delete_activity(id)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn toggle_tracking(state: State<AppState>, enabled: bool) -> Result<(), String> {
    let mut is_tracking = state.is_tracking.lock();
    *is_tracking = enabled;
    Ok(())
}

#[tauri::command]
pub fn get_tracking_status(state: State<AppState>) -> Result<bool, String> {
    let is_tracking = state.is_tracking.lock();
    Ok(*is_tracking)
}
