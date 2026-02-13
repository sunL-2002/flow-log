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

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ActivityType {
    pub id: String,
    pub name: String,
    pub icon: String,
    pub color: String,
}

pub fn get_activity_types() -> Vec<ActivityType> {
    vec![
        ActivityType {
            id: "coding".to_string(),
            name: "编码".to_string(),
            icon: "🟢".to_string(),
            color: "#4CAF50".to_string(),
        },
        ActivityType {
            id: "meeting".to_string(),
            name: "会议".to_string(),
            icon: "🔴".to_string(),
            color: "#F44336".to_string(),
        },
        ActivityType {
            id: "communication".to_string(),
            name: "沟通".to_string(),
            icon: "🟡".to_string(),
            color: "#FFC107".to_string(),
        },
        ActivityType {
            id: "learning".to_string(),
            name: "学习".to_string(),
            icon: "🟣".to_string(),
            color: "#9C27B0".to_string(),
        },
        ActivityType {
            id: "design".to_string(),
            name: "设计".to_string(),
            icon: "🎨".to_string(),
            color: "#E91E63".to_string(),
        },
        ActivityType {
            id: "browsing".to_string(),
            name: "浏览".to_string(),
            icon: "🌐".to_string(),
            color: "#2196F3".to_string(),
        },
        ActivityType {
            id: "rest".to_string(),
            name: "休息".to_string(),
            icon: "🔵".to_string(),
            color: "#03A9F4".to_string(),
        },
        ActivityType {
            id: "other".to_string(),
            name: "其他".to_string(),
            icon: "🟠".to_string(),
            color: "#FF9800".to_string(),
        },
        ActivityType {
            id: "unknown".to_string(),
            name: "未识别".to_string(),
            icon: "⚪".to_string(),
            color: "#9E9E9E".to_string(),
        },
    ]
}
