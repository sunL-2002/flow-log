use crate::recognizer::rules::RecognitionRule;

pub struct ActivityRecognizer {
    rules: Vec<RecognitionRule>,
}

impl ActivityRecognizer {
    pub fn new() -> Self {
        ActivityRecognizer {
            rules: Self::default_rules(),
        }
    }
    
    pub fn recognize(&self, window_title: &str) -> (String, i32) {
        if window_title.is_empty() {
            return ("unknown".to_string(), 0);
        }
        
        let title_lower = window_title.to_lowercase();
        
        for rule in &self.rules {
            for keyword in rule.keywords.split(',') {
                let keyword = keyword.trim().to_lowercase();
                if title_lower.contains(&keyword) {
                    return (rule.activity_type.clone(), rule.confidence);
                }
            }
        }
        
        ("unknown".to_string(), 50)
    }
    
    pub fn update_rules(&mut self, rules: Vec<RecognitionRule>) {
        self.rules = rules;
    }
    
    fn default_rules() -> Vec<RecognitionRule> {
        vec![
            RecognitionRule {
                id: 1,
                keywords: "vs code,visual studio,idea,intellij,webstorm,pycharm,goland,clion,atom,sublime,code".to_string(),
                activity_type: "coding".to_string(),
                confidence: 95,
                is_default: true,
                is_enabled: true,
            },
            RecognitionRule {
                id: 2,
                keywords: "腾讯会议,zoom,teams,钉钉会议,飞书会议,webex,meeting,会议".to_string(),
                activity_type: "meeting".to_string(),
                confidence: 95,
                is_default: true,
                is_enabled: true,
            },
            RecognitionRule {
                id: 3,
                keywords: "钉钉,微信,slack,telegram,qq,飞书,discord,weixin".to_string(),
                activity_type: "communication".to_string(),
                confidence: 80,
                is_default: true,
                is_enabled: true,
            },
            RecognitionRule {
                id: 4,
                keywords: "figma,sketch,xd,photoshop,illustrator,blender".to_string(),
                activity_type: "design".to_string(),
                confidence: 90,
                is_default: true,
                is_enabled: true,
            },
            RecognitionRule {
                id: 5,
                keywords: "chrome,edge,firefox,safari,browser".to_string(),
                activity_type: "browsing".to_string(),
                confidence: 60,
                is_default: true,
                is_enabled: true,
            },
        ]
    }
}

impl Default for ActivityRecognizer {
    fn default() -> Self {
        Self::new()
    }
}
