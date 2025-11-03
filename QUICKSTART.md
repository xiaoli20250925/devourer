# 快速开始指南

## 前置要求

- Node.js 18+ 
- npm 或 yarn

## 安装

```bash
# 克隆仓库
git clone <repository-url>
cd apikey-manager

# 安装依赖
npm install
```

## 开发

```bash
# 启动开发服务器
npm run dev
```

这会启动：
- Vite 开发服务器（http://localhost:5173）
- Electron 应用窗口
- 热重载功能

## 构建

```bash
# 构建生产版本
npm run build
```

输出：
- `dist/` - 渲染进程构建文件
- `dist-electron/` - 主进程和预加载脚本

## 打包应用

```bash
# 打包为可分发的应用
npm run electron:build
```

输出在 `release/` 目录：
- macOS: `.dmg` 和 `.zip`
- Windows: `.exe` 安装包
- Linux: `.AppImage` 和 `.deb`

## 开发技巧

### 调试

开发模式下会自动打开 Chrome DevTools，你可以：
- 查看控制台日志
- 调试 React 组件
- 检查网络请求

### 修改样式

样式文件位于 `src/renderer/styles/globals.css`，使用 TailwindCSS 4.x。

### 添加新功能

1. 在 `src/main/main.ts` 添加 IPC 处理器
2. 在 `src/preload/preload.ts` 暴露 API
3. 在 `src/renderer/` 创建 UI 组件
4. 更新类型定义

## 项目结构

```
src/
├── main/          # Electron 主进程
├── preload/       # 预加载脚本
└── renderer/      # React 应用
    ├── components/ # UI 组件
    ├── hooks/     # React Hooks
    ├── lib/       # 工具函数
    ├── styles/    # 样式文件
    └── types/     # TypeScript 类型
```

## 常用命令

```bash
# 开发
npm run dev

# 构建
npm run build

# 预览构建
npm run preview

# 打包应用
npm run electron:build
```

## 技术栈

- **Electron**: 桌面应用框架
- **Vite**: 构建工具
- **React 19**: UI 框架
- **TypeScript**: 类型系统
- **TailwindCSS 4**: 样式框架
- **Radix UI**: 组件库
- **Lucide React**: 图标库

## 下一步

- 阅读 [README.md](./README.md) 了解项目概览
- 查看 [USAGE.md](./USAGE.md) 学习如何使用
- 查看 [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) 了解项目结构

## 问题排查

### 构建失败

```bash
# 清理依赖重新安装
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Electron 无法启动

检查是否有端口冲突，默认使用 5173 端口。

### 样式不生效

确保 PostCSS 和 TailwindCSS 配置正确。

## 贡献

欢迎提交 Pull Request 和 Issue！
