use chrono::{DateTime, Utc, NaiveDateTime, NaiveDate};

pub fn format_duration(seconds: i64) -> String {
    let hours = seconds / 3600;
    let minutes = (seconds % 3600) / 60;
    let secs = seconds % 60;
    
    if hours > 0 {
        format!("{}小时{}分钟", hours, minutes)
    } else if minutes > 0 {
        format!("{}分钟", minutes)
    } else {
        format!("{}秒", secs)
    }
}

pub fn parse_datetime(s: &str) -> Option<DateTime<Utc>> {
    DateTime::parse_from_rfc3339(s)
        .map(|dt| dt.with_timezone(&Utc))
        .ok()
}

pub fn get_today() -> String {
    Utc::now().format("%Y-%m-%d").to_string()
}

pub fn get_week_range(date: &str) -> (String, String) {
    let end = NaiveDate::parse_from_str(date, "%Y-%m-%d").unwrap_or_else(|_| Utc::now().date_naive());
    let start = end - chrono::Duration::days(6);
    
    (start.format("%Y-%m-%d").to_string(), end.format("%Y-%m-%d").to_string())
}

pub fn format_time_range(start: &str, end: &str) -> String {
    let start_dt = parse_datetime(start);
    let end_dt = parse_datetime(end);
    
    match (start_dt, end_dt) {
        (Some(s), Some(e)) => {
            format!(
                "{} - {}",
                s.format("%H:%M"),
                e.format("%H:%M")
            )
        }
        _ => String::new()
    }
}
