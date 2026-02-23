# QuickQR - Chrome 扩展程序

![Plasmo](https://img.shields.io/badge/Framework-Plasmo-blue?style=flat-square) ![Vue](https://img.shields.io/badge/Vue-3.0-green?style=flat-square) ![Node](https://img.shields.io/badge/Node-20.22-green?style=flat-square) ![Security](https://img.shields.io/badge/Security-Enhanced-red?style=flat-square)

**QuickQR** 是一款风格独特的 Chrome 浏览器侧边栏扩展（Sidepanel Extension）。它被设计为二维码处理的”数字瑞士军刀”，结合了复古杂志风（Retro Magazine UI）的视觉体验与强大的实用功能，并内置了**智能安全检查系统**，保护用户免受恶意二维码的威胁。

![qr3](https://rolingg.top/images/quickQR/qrGithub.png)

## ✨ 主要功能 (Features)

QuickQR 通过侧边栏 (Sidepanel) 提供一站式服务，主要包含三大核心模块：

### 1. 📷 屏幕截图扫码 (SCAN) ⭐️

- **交互式截图**：点击按钮后，在当前网页上自由框选区域。
- **自动识别**：扩展自动捕获选区并解析其中的二维码内容。
- **右键菜单集成**：直接在网页图片上点击右键 -> `QuickQR: 识别图中二维码`，立即在侧边栏显示结果。
- **智能安全检查**：自动检测 URL 风险，保护用户安全。
- **可选自动跳转**：开启开关后，扫描到 URL 自动在新标签页打开（安全检查通过后）。

### 2. 📂 本地图片解码 (FILE) ⭐️

- **拖拽上传**：支持将电脑本地文件夹中的二维码图片直接拖入侧边栏。
- **点击上传**：点击虚线区域选择文件，快速解析本地资源。
- **独立安全控制**：FILE 标签页拥有独立的自动跳转开关，与 SCAN 互不影响。

### 3. 🛠️ 二维码生成 (MAKE) ⭐️

- **文本转码**：输入任意文本或链接，实时生成矢量级二维码。
- **右键生成**：选中网页上的文字 -> 右键 -> `QuickQR: 为选中文字生成二维码`，直接跳转并生成。

### 4. 🛡️ 安全防护系统 (Security) 🆕

QuickQR 内置了**12 项安全检查规则**，全方位保护用户免受恶意二维码威胁：

#### 基础安全检查
- ✅ **HTTP/HTTPS 检测**：标记不安全的 HTTP 连接
- ✅ **IP 地址检测**：识别使用 IP 而非域名的可疑 URL
- ✅ **超长 URL 检测**：检测钓鱼网站常用的超长 URL
- ✅ **高风险 TLD 检测**：识别 .tk、.ml、.ga 等免费高风险域名
- ✅ **非标准端口检测**：标记使用非 80/443 端口的 URL

#### 高级威胁检测
- ✅ **同形字攻击检测**：识别 O/0、1/l/I、5/S 等字符混淆（如 `goo0le.com`）
- ✅ **品牌钓鱼检测**：检测冒充 PayPal、Amazon、Apple 等知名品牌的钓鱼网站
- ✅ **短链接检测**：标记 bit.ly、tinyurl.com 等短链接服务
- ✅ **钓鱼关键词检测**：识别包含 login、verify、secure 等敏感词的可疑 URL
- ✅ **多重 @ 符号检测**：检测钓鱼网站常用的 URL 伪装手法
- ✅ **恶意编码字符检测**：识别 %00、%0d、%0a 等可疑编码
- ✅ **过多子域名检测**：标记域名层级过深的可疑网站

#### 三级风险分类
- 🟢 **低风险 (Low)**：安全 URL，无警告
- 🟡 **中风险 (Medium)**：可疑特征，显示警告并需要用户确认
- 🔴 **高风险 (High)**：严重威胁，直接阻止自动跳转

#### 用户控制
- **手动打开按钮**：即使自动跳转关闭，也可手动打开 URL
- **可视化警告**：彩色警告卡片清晰展示所有风险点
- **独立开关控制**：SCAN 和 FILE 标签页各自独立控制自动跳转

------

## 🛠 技术栈 (Tech Stack)

本项目基于 [Plasmo Framework](https://docs.plasmo.com/) 构建，使用了以下技术：

- **Core**: Plasmo (Chrome Extension V3 Manifest)
- **UI Framework**: Vue 3 (Script Setup + Composition API)
- **Styling**: 自定义 CSS (复古杂志风格)
- **Libraries**:
  - `jsqr`: 用于二维码解码
  - `qrcode.vue`: 用于二维码生成
- **Architecture**: 组件化设计，代码复用率高

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

> 如果遇到 `math-intrinsics` 相关报错，请将 `node_modules` 里对应包名的 `package.json` 中 `”main”: false` 删除或修改。

### 3. 加载到 Chrome

1. 打开 Chrome 浏览器，访问 `chrome://extensions/`。
2. 开启右上角的 **”开发者模式” (Developer mode)**。
3. 点击左上角的 **”加载已解压的扩展程序” (Load unpacked)**。
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

```
quick-qr/
├── assets/                          # 静态资源（图标等）
├── components/                      # Vue 组件
│   └── sidepanel-result-section.vue # 结果展示组件（复用）
├── contents/                        # Content Scripts
│   └── content-overlay.vue          # 截图选区覆盖层
├── lib/                            # 工具库
│   └── generator.ts                # 二维码生成逻辑
├── sidepanel.vue                   # 核心 UI（SCAN/FILE/MAKE）
├── popup.vue                       # 弹出窗口
├── background.ts                   # 后台服务（右键菜单等）
└── README.md                       # 项目文档
```

### 核心文件说明

- **`sidepanel.vue`**: 主界面，包含三个标签页的逻辑、安全检查系统、自动跳转控制
- **`components/sidepanel-result-section.vue`**: 结果展示组件，包含安全警告显示
- **`background.ts`**: 后台服务脚本，处理右键菜单 (`contextMenus`) 事件
- **`contents/content-overlay.vue`**: 注入页面的截图选区组件

------

## 🔒 安全特性详解

### 安全检查流程

1. **扫描二维码** → 2. **解析 URL** → 3. **12 项安全检查** → 4. **风险评级** → 5. **用户决策**

### 示例场景

**场景 1：正常网站**
```
https://www.google.com
→ ✅ 无警告，开关打开时直接跳转
```

**场景 2：可疑网站**
```
https://login-verify.suspicious-site.tk
→ ⚠️ 显示警告：高风险 TLD + 钓鱼关键词
→ 开关打开时弹出确认框
```

**场景 3：高危网站**
```
https://paypal-secure.com
→ 🚨 品牌钓鱼检测触发
→ 直接阻止自动跳转，显示红色警告
```

------

## 🎨 设计理念

QuickQR 采用**复古杂志风格 (Retro Magazine UI)**，灵感来源于 20 世纪中期的印刷杂志：

- **粗边框 + 阴影**：营造纸质印刷的立体感
- **高对比度配色**：黄色主题 + 黑色边框
- **字体排版**：大写字母 + 紧凑布局
- **交互反馈**：按钮按下时的位移效果模拟实体按键

------

## 🤝 Credits

Presented by **RoLingG & Gemini**.

---

## 📄 License

MIT License - 自由使用，欢迎贡献！