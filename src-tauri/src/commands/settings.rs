use tauri::State;
use crate::AppState;
use crate::database::settings::AppSettings;
use crate::database::rules::RecognitionRule;
use crate::database::rules::NewRule;

#[tauri::command]
pub fn get_settings(state: State<AppState>) -> Result<AppSettings, String> {
    let db = state.db.lock();
    db.get_settings()
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn update_settings(state: State<AppState>, settings: AppSettings) -> Result<(), String> {
    let db = state.db.lock();
    db.update_settings(&settings)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_rules(state: State<AppState>) -> Result<Vec<RecognitionRule>, String> {
    let db = state.db.lock();
    db.get_all_rules()
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn add_rule(state: State<AppState>, rule: NewRule) -> Result<i64, String> {
    let db = state.db.lock();
    db.add_rule(&rule)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn update_rule(state: State<AppState>, id: i64, keywords: String, activity_type: String, confidence: i32) -> Result<(), String> {
    let db = state.db.lock();
    db.update_rule(id, &keywords, &activity_type, confidence)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn delete_rule(state: State<AppState>, id: i64) -> Result<(), String> {
    let db = state.db.lock();
    db.delete_rule(id)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn is_first_launch(state: State<AppState>) -> Result<bool, String> {
    let db = state.db.lock();
    db.is_first_launch()
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn set_first_launch_complete(state: State<AppState>) -> Result<(), String> {
    let db = state.db.lock();
    db.set_first_launch_complete()
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn export_data(state: State<AppState>) -> Result<String, String> {
    let db = state.db.lock();
    
    let activities = db.get_activities_by_date_range("1970-01-01", "2100-12-31")
        .map_err(|e| e.to_string())?;
    
    serde_json::to_string_pretty(&activities)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn clear_all_data(state: State<AppState>) -> Result<(), String> {
    let db = state.db.lock();
    let conn = db.get_connection();
    
    conn.execute("DELETE FROM activities", [])
        .map_err(|e| e.to_string())?;
    
    Ok(())
}
