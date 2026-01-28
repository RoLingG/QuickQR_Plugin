# QuickQR - Chrome 扩展程序

![Plasmo](https://img.shields.io/badge/Framework-Plasmo-blue?style=flat-square) ![Vue](https://img.shields.io/badge/Vue-3.0-green?style=flat-square) ![Node](https://img.shields.io/badge/Node-20.22-green?style=flat-square)

**QuickQR** 是一款风格独特的 Chrome 浏览器侧边栏扩展（Sidepanel Extension）。它被设计为二维码处理的“数字瑞士军刀”，结合了复古杂志风（Retro Magazine UI）的视觉体验与强大的实用功能。

![qr3](https://rolingg.top/images/quickQR/qrGithub.png)

## ✨ 主要功能 (Features)

QuickQR 通过侧边栏 (Sidepanel) 提供一站式服务，主要包含三大核心模块：

### 1. 📷 屏幕截图扫码 (SCAN) ⭐️

- **交互式截图**：点击按钮后，在当前网页上自由框选区域。
- **自动识别**：扩展自动捕获选区并解析其中的二维码内容。
- **右键菜单集成**：直接在网页图片上点击右键 -> `QuickQR: 识别图中二维码`，立即在侧边栏显示结果。

### 2. 📂 本地图片解码 (FILE) ⭐️

- **拖拽上传**：支持将电脑本地文件夹中的二维码图片直接拖入侧边栏。
- **点击上传**：点击虚线区域选择文件，快速解析本地资源。

### 3. 🛠️ 二维码生成 (MAKE) ⭐️

- **文本转码**：输入任意文本或链接，实时生成矢量级二维码。
- **右键生成**：选中文页上的文字 -> 右键 -> `QuickQR: 为选中文字生成二维码`，直接跳转并生成。

------

## 🛠 技术栈 (Tech Stack)

本项目基于 [Plasmo Framework](https://docs.plasmo.com/) 构建，使用了以下技术：

- **Core**: Plasmo (Chrome Extension V3 Manifest)
- **UI Framework**: Vue 3 (Script Setup)
- **Styling**: Tailwind CSS + 自定义 CSS (复古杂志风格)
- **Libraries**:
  - `jsqr`: 用于二维码解码
  - `qrcode.vue`: 用于二维码生成

------

## 🚀 开发指南 (Getting Started)

### 1. 安装依赖

首先，确保你安装了 Node.js 和包管理器（推荐 pnpm）。

```bash
pnpm install
# or
npm install
```

### 2. 启动开发服务器

运行开发命令，Plasmo 会监听文件变化并自动重新构建。

```bash
pnpm dev
# or
npm run dev
```

> 如果遇到 `math-intrinsics` 相关报错出现，请将 `node_modules` 里对应包名的 `package.json` 中 `main": false` 给删掉或者修改掉，从报错信息可以看得到是这里导致的编译运行的报错问题。

### 3. 加载到 Chrome

1. 打开 Chrome 浏览器，访问 `chrome://extensions/`。
2. 开启右上角的 **"开发者模式" (Developer mode)**。
3. 点击左上角的 **"加载已解压的扩展程序" (Load unpacked)**。
4. 选择本项目下的 `build/chrome-mv3-dev` 文件夹。

> **提示**：当你修改 `background.ts` 或 `manifest` 配置时，建议在扩展管理页面点击刷新按钮。修改 UI (`sidepanel.vue`) 通常会自动热更新。

------

## 📦 打包发布 (Production Build)

当你准备发布扩展时，运行以下命令生成生产环境包：

```bash
pnpm build
# or
npm run build
```

构建完成后，`build/chrome-mv3-prod` 文件夹内的内容即为可发布到 Chrome Web Store 的最终产物（通常需要压缩为 .zip）。

------

## 📝 目录结构说明

- `assets/`: 存放静态资源（如图标）。
- `sidepanel.vue`: **核心 UI**，包含 Scan/File/Make 三个 Tab 的逻辑与样式。
- `background.ts`: 后台服务脚本，处理右键菜单 (`contextMenus`) 事件。
- `content.ts`: 注入页面的脚本，负责处理截图/框选逻辑。

------

## 🤝 Credits

Presented by **RoLingG & Gemini**.