# 项目结构说明

## 目录结构

```
apikey-manager/
├── src/
│   ├── main/
│   │   └── main.ts                 # Electron 主进程
│   ├── preload/
│   │   └── preload.ts              # 预加载脚本（IPC 桥接）
│   └── renderer/
│       ├── components/             # React 组件
│       │   ├── Button.tsx
│       │   ├── Input.tsx
│       │   ├── Label.tsx
│       │   ├── Dialog.tsx
│       │   ├── Toast.tsx
│       │   ├── Toaster.tsx
│       │   ├── DropdownMenu.tsx
│       │   ├── ApiKeyCard.tsx      # API Key 卡片组件
│       │   └── ApiKeyDialog.tsx    # 添加/编辑对话框
│       ├── hooks/
│       │   └── useToast.tsx        # Toast 通知 Hook
│       ├── lib/
│       │   └── utils.ts            # 工具函数
│       ├── styles/
│       │   └── globals.css         # 全局样式
│       ├── types/
│       │   └── index.ts            # TypeScript 类型定义
│       ├── App.tsx                 # 主应用组件
│       └── main.tsx                # 渲染进程入口
├── dist/                           # 构建输出（渲染进程）
├── dist-electron/                  # 构建输出（主进程和预加载）
├── index.html                      # HTML 模板
├── vite.config.ts                  # Vite 配置
├── tsconfig.json                   # TypeScript 配置
├── postcss.config.js               # PostCSS 配置
├── tailwind.config.js              # Tailwind 配置
├── electron-builder.json           # Electron Builder 配置
├── package.json                    # 项目配置
└── README.md                       # 项目说明
```

## 核心功能模块

### 1. 主进程 (src/main/main.ts)
- 创建应用窗口
- 处理 IPC 通信
- 数据持久化（JSON 文件）
- API 连接测试

### 2. 预加载脚本 (src/preload/preload.ts)
- 暴露安全的 API 给渲染进程
- 类型定义和接口

### 3. 渲染进程 (src/renderer/)
- React 应用主界面
- 组件库和状态管理
- UI 交互逻辑

## 数据流

```
用户操作 → React 组件 → electronAPI → IPC → 主进程 → 文件系统
                                                    ↓
                                           返回结果 → 更新 UI
```

## 主要依赖

- **electron**: ^39.0.0
- **react**: ^19.2.0
- **vite**: ^7.1.12
- **typescript**: ^5.9.3
- **@radix-ui/***: UI 组件库
- **lucide-react**: 图标库
- **tailwindcss**: ^4.1.16

## 数据存储

API Keys 存储在用户数据目录下的 `apikeys.json` 文件中：
- macOS: `~/Library/Application Support/API Key Manager/`
- Windows: `%APPDATA%/API Key Manager/`
- Linux: `~/.config/API Key Manager/`

## 支持的 AI 提供商

- OpenAI
- Anthropic
- Google
- Cohere
- Mistral
- Custom (自定义)

## 开发与构建

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建应用
npm run build

# 打包 Electron 应用
npm run electron:build
```
