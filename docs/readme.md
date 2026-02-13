# 项目结构
flow-log/
├── src-tauri/                    # Tauri Rust 后端
│   ├── src/
│   │   ├── main.rs              # 主入口
│   │   ├── lib.rs               # 库入口
│   │   ├── commands/            # Tauri 命令
│   │   │   ├── activity.rs      # 活动记录命令
│   │   │   ├── settings.rs      # 设置命令
│   │   │   └── report.rs        # 周报命令
│   │   ├── database/            # SQLite 数据库
│   │   │   ├── schema.rs        # 数据库结构
│   │   │   ├── activity.rs      # 活动记录
│   │   │   ├── rules.rs         # 识别规则
│   │   │   └── settings.rs      # 应用设置
│   │   ├── monitor/             # 窗口监听 (Win32 API)
│   │   │   ├── windows.rs       # Windows API
│   │   │   └── tracker.rs       # 窗口追踪
│   │   ├── recognizer/          # 活动识别引擎
│   │   └── tray/                # 系统托盘
│   ├── Cargo.toml
│   └── tauri.conf.json
│
├── src/                         # React 前端
│   ├── components/              # UI 组件
│   │   ├── common/              # 通用组件
│   │   ├── layout/              # 布局组件
│   │   ├── timeline/            # 时间轴组件
│   │   ├── statistics/          # 统计组件
│   │   └── onboarding/          # 引导组件
│   ├── pages/                   # 页面
│   ├── stores/                  # Zustand 状态
│   └── types/                   # TypeScript 类型
│
├── package.json
├── tailwind.config.js
└── vite.config.ts

# 安装依赖
npm install

# 开发模式运行
npm run tauri:dev

# 构建生产版本
npm run tauri:build


# 技术栈
- 桌面框架 : Tauri 2.x (Rust 后端)
- 前端框架 : React 18 + TypeScript
- 样式方案 : Tailwind CSS
- 状态管理 : Zustand
- 数据存储 : SQLite (rusqlite)
- 窗口监听 : Win32 API