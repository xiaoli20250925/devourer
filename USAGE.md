# 使用说明

## 功能介绍

### 1. 添加 API Key

点击右上角的「添加 API Key」按钮，填写以下信息：

- **名称**: 给这个 API Key 起个便于识别的名字，例如「我的 OpenAI Key」
- **提供商**: 选择 AI 服务提供商（OpenAI、Anthropic、Google 等）
- **API Key**: 输入你的 API Key
- **Base URL** (可选): 自定义 API 端点地址

### 2. 查看和管理 API Keys

所有添加的 API Keys 会以卡片形式展示，每个卡片包含：

- API Key 名称和提供商
- 脱敏后的 API Key（显示前 4 位和后 4 位）
- Base URL（如果有）
- 创建时间

### 3. 复制功能

每个卡片都提供快捷复制功能：

- 点击 API Key 右侧的复制按钮，快速复制完整的 API Key
- 点击 Base URL 右侧的复制按钮，复制完整的 URL
- 通过更多操作菜单（三个点）也可以复制 API Key

### 4. 测试连接

点击「测试连接」按钮，系统会：

- 使用你的 API Key 尝试连接到服务提供商
- 显示连接状态（成功/失败）
- 卡片右上角会显示连接状态图标：
  - ✅ 绿色勾：连接成功
  - ❌ 红色叉：连接失败

### 5. 编辑 API Key

点击更多操作菜单 → 编辑，可以修改：

- API Key 名称
- 提供商
- API Key 本身
- Base URL

### 6. 删除 API Key

点击更多操作菜单 → 删除，会弹出确认对话框，防止误删。

### 7. 搜索功能

使用顶部的搜索框，可以：

- 按 API Key 名称搜索
- 按提供商搜索
- 实时过滤显示结果

## 支持的 AI 提供商

### OpenAI
- 默认 Base URL: `https://api.openai.com/v1`
- API Key 格式: `sk-...`

### Anthropic
- 默认 Base URL: `https://api.anthropic.com/v1`
- API Key 格式: `sk-ant-...`

### Google (Gemini)
- 默认 Base URL: `https://generativelanguage.googleapis.com/v1`
- API Key 格式: 各种格式

### Cohere
- 默认 Base URL: `https://api.cohere.ai/v1`

### Mistral
- 默认 Base URL: `https://api.mistral.ai/v1`

### Custom (自定义)
可以输入任何兼容 OpenAI API 格式的服务端点

## 数据安全

- 所有 API Keys 都存储在本地计算机上
- 使用 Electron 的安全存储机制
- 不会上传到任何服务器
- 数据文件位置：
  - macOS: `~/Library/Application Support/API Key Manager/apikeys.json`
  - Windows: `%APPDATA%/API Key Manager/apikeys.json`
  - Linux: `~/.config/API Key Manager/apikeys.json`

## 快捷键

- `Ctrl/Cmd + F`: 聚焦到搜索框（功能待实现）
- `Ctrl/Cmd + N`: 打开添加 API Key 对话框（功能待实现）
- `ESC`: 关闭对话框

## 注意事项

1. **API Key 安全**: 请妥善保管你的 API Keys，不要分享给他人
2. **测试连接**: 某些提供商可能需要特定的请求头或认证方式，测试失败不一定代表 API Key 无效
3. **Base URL**: 如果使用代理或自定义端点，请确保 URL 格式正确
4. **备份**: 建议定期备份 `apikeys.json` 文件

## 常见问题

### Q: 为什么测试连接失败？
A: 可能的原因：
- API Key 无效或已过期
- 网络连接问题
- Base URL 配置错误
- 服务提供商 API 暂时不可用

### Q: 数据会同步到云端吗？
A: 不会。所有数据都存储在本地，完全离线工作。

### Q: 可以导入/导出 API Keys 吗？
A: 目前暂不支持，但你可以直接复制 `apikeys.json` 文件进行备份和迁移。

### Q: 支持哪些操作系统？
A: 支持 macOS、Windows 和 Linux。

## 技术支持

如有问题或建议，欢迎提交 Issue。
