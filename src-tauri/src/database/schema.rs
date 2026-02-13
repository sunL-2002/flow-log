pub const CREATE_ACTIVITIES_TABLE: &str = "
CREATE TABLE IF NOT EXISTS activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    duration_seconds INTEGER NOT NULL,
    window_title TEXT NOT NULL,
    activity_type TEXT NOT NULL,
    description TEXT,
    confidence INTEGER DEFAULT 0,
    is_edited INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_activities_start_time ON activities(start_time);
CREATE INDEX IF NOT EXISTS idx_activities_activity_type ON activities(activity_type);
";

pub const CREATE_RULES_TABLE: &str = "
CREATE TABLE IF NOT EXISTS recognition_rules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    keywords TEXT NOT NULL,
    activity_type TEXT NOT NULL,
    confidence INTEGER DEFAULT 80,
    is_default INTEGER DEFAULT 0,
    is_enabled INTEGER DEFAULT 1,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_rules_activity_type ON recognition_rules(activity_type);
";

pub const CREATE_SETTINGS_TABLE: &str = "
CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
";
