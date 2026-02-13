use tauri::State;
use crate::AppState;
use crate::database::activity::Activity;
use chrono::{NaiveDate, Duration};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct WeeklyReport {
    pub start_date: String,
    pub end_date: String,
    pub total_seconds: i64,
    pub daily_activities: Vec<DayActivities>,
    pub summary: Vec<ActivitySummary>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DayActivities {
    pub date: String,
    pub activities: Vec<ActivitySummary>,
    pub total_seconds: i64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ActivitySummary {
    pub activity_type: String,
    pub total_seconds: i64,
    pub description: Option<String>,
    pub count: i32,
}

#[tauri::command]
pub fn generate_weekly_report(state: State<AppState>, end_date: String) -> Result<WeeklyReport, String> {
    let end = NaiveDate::parse_from_str(&end_date, "%Y-%m-%d")
        .map_err(|e| format!("Invalid date format: {}", e))?;
    
    let start = end - Duration::days(6);
    let start_str = start.format("%Y-%m-%d").to_string();
    
    let db = state.db.lock();
    let activities = db.get_activities_by_date_range(&start_str, &end_date)
        .map_err(|e| e.to_string())?;
    
    let report = generate_report_from_activities(&start_str, &end_date, activities);
    
    Ok(report)
}

fn generate_report_from_activities(start_date: &str, end_date: &str, activities: Vec<Activity>) -> WeeklyReport {
    use std::collections::HashMap;
    
    let mut daily_map: HashMap<String, Vec<Activity>> = HashMap::new();
    let mut type_totals: HashMap<String, i64> = HashMap::new();
    let mut total_seconds: i64 = 0;
    
    for activity in activities {
        let date = activity.start_time.split('T').next().unwrap_or("").to_string();
        
        daily_map.entry(date.clone())
            .or_insert_with(Vec::new)
            .push(activity.clone());
        
        *type_totals.entry(activity.activity_type.clone()).or_insert(0) += activity.duration_seconds;
        total_seconds += activity.duration_seconds;
    }
    
    let mut daily_activities: Vec<DayActivities> = Vec::new();
    
    let start = NaiveDate::parse_from_str(start_date, "%Y-%m-%d").unwrap();
    let end = NaiveDate::parse_from_str(end_date, "%Y-%m-%d").unwrap();
    
    let mut current = start;
    while current <= end {
        let date_str = current.format("%Y-%m-%d").to_string();
        let day_acts = daily_map.get(&date_str).cloned().unwrap_or_default();
        
        let mut day_type_totals: HashMap<String, i64> = HashMap::new();
        let mut day_total: i64 = 0;
        
        for act in &day_acts {
            *day_type_totals.entry(act.activity_type.clone()).or_insert(0) += act.duration_seconds;
            day_total += act.duration_seconds;
        }
        
        let summaries: Vec<ActivitySummary> = day_type_totals
            .into_iter()
            .map(|(activity_type, total_seconds)| ActivitySummary {
                activity_type,
                total_seconds,
                description: None,
                count: 1,
            })
            .collect();
        
        daily_activities.push(DayActivities {
            date: date_str,
            activities: summaries,
            total_seconds: day_total,
        });
        
        current += Duration::days(1);
    }
    
    let summary: Vec<ActivitySummary> = type_totals
        .into_iter()
        .map(|(activity_type, total_seconds)| ActivitySummary {
            activity_type,
            total_seconds,
            description: None,
            count: 1,
        })
        .collect();
    
    WeeklyReport {
        start_date: start_date.to_string(),
        end_date: end_date.to_string(),
        total_seconds,
        daily_activities,
        summary,
    }
}

#[tauri::command]
pub fn format_report_text(report: WeeklyReport) -> String {
    let mut text = String::new();
    
    text.push_str(&format!("周报 ({} - {})\n\n", report.start_date, report.end_date));
    
    let total_hours = report.total_seconds as f64 / 3600.0;
    text.push_str(&format!("本周总专注时长: {:.1} 小时\n\n", total_hours));
    
    text.push_str("时间分配:\n");
    for summary in &report.summary {
        let hours = summary.total_seconds as f64 / 3600.0;
        text.push_str(&format!("  {}: {:.1} 小时\n", summary.activity_type, hours));
    }
    
    text.push_str("\n每日详情:\n");
    for day in &report.daily_activities {
        let hours = day.total_seconds as f64 / 3600.0;
        text.push_str(&format!("{}: {:.1} 小时\n", day.date, hours));
    }
    
    text
}
