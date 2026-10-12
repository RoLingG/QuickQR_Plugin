# QuickQR - Chrome 擴充功能

[English](../README.md) | [简体中文](README_zh.md) | **繁體中文**

![Plasmo](https://img.shields.io/badge/Framework-Plasmo-blue?style=flat-square) ![Vue](https://img.shields.io/badge/Vue-3.0-green?style=flat-square) ![Node](https://img.shields.io/badge/Node-20.22-green?style=flat-square) ![Security](https://img.shields.io/badge/Security-Enhanced-red?style=flat-square)

**QuickQR** 是一款風格獨特的 Chrome 瀏覽器側邊欄擴充功能（Sidepanel Extension）。它被設計為 QR Code 處理的"數位瑞士刀"，結合了復古雜誌風（Retro Magazine UI）的視覺體驗與強大的實用功能，並內建了**智慧型安全檢查系統**，保護使用者免受惡意 QR Code 的威脅。

![qr3](https://rolingg.top/images/quickQR/qrGithub.png)

## ✨ 主要功能 (Features)

QuickQR 透過側邊欄 (Sidepanel) 提供一站式服務，主要包含三大核心模組：

### 1. 📷 螢幕截圖掃碼 (SCAN) ⭐️

- **互動式截圖**：點擊按鈕後，在目前網頁上自由框選區域。
- **自動辨識**：擴充功能自動擷取選區並解析其中的 QR Code 內容。
- **右鍵選單整合**：直接在網頁圖片上點擊右鍵 -> `QuickQR: 辨識圖片中的 QR Code`，立即在側邊欄顯示結果。
- **智慧型安全檢查**：自動偵測 URL 風險，保護使用者安全。
- **可選自動跳轉**：開啟開關後，掃描到 URL 自動在新分頁開啟（安全檢查通過後）。

### 2. 📂 本機圖片解碼 (FILE) ⭐️

- **拖曳上傳**：支援將電腦本機資料夾中的 QR Code 圖片直接拖入側邊欄。
- **點擊上傳**：點擊虛線區域選擇檔案，快速解析本機資源。
- **獨立安全控制**：FILE 分頁擁有獨立的自動跳轉開關，與 SCAN 互不影響。

### 3. 🛠️ QR Code 生成 (MAKE) ⭐️

- **文字轉碼**：輸入任何文字或連結，即時生成高品質 QR Code。
- **右鍵生成**：選取網頁上的文字 -> 右鍵 -> `QuickQR: 為選取文字生成 QR Code`，直接跳轉並生成。

### 4. 🛡️ 安全防護系統 (Security) 🆕

QuickQR 內建了**12 項安全檢查規則**，全方位保護使用者免受惡意 QR Code 威脅：

#### 基礎安全檢查
- ✅ **HTTP/HTTPS 偵測**：標記不安全的 HTTP 連線
- ✅ **IP 位址偵測**：辨識使用 IP 而非網域的可疑 URL
- ✅ **超長 URL 偵測**：偵測釣魚網站常用的超長 URL
- ✅ **高風險 TLD 偵測**：辨識 .tk、.ml、.ga 等免費高風險網域
- ✅ **非標準連接埠偵測**：標記使用非 80/443 連接埠的 URL

#### 進階威脅偵測
- ✅ **同形字攻擊偵測**：辨識 O/0、1/l/I、5/S 等字元混淆（如 `goo0le.com`）
- ✅ **品牌釣魚偵測**：偵測冒充 PayPal、Amazon、Apple 等知名品牌的釣魚網站
- ✅ **短網址偵測**：標記 bit.ly、tinyurl.com 等短網址服務
- ✅ **釣魚關鍵字偵測**：辨識包含 login、verify、secure 等敏感字的可疑 URL
- ✅ **多重 @ 符號偵測**：偵測釣魚網站常用的 URL 偽裝手法
- ✅ **惡意編碼字元偵測**：辨識 %00、%0d、%0a 等可疑編碼
- ✅ **過多子網域偵測**：標記網域層級過深的可疑網站

#### 三級風險分類
- 🟢 **低風險 (Low)**：安全 URL，無警告
- 🟡 **中風險 (Medium)**：可疑特徵，顯示警告並需要使用者確認
- 🔴 **高風險 (High)**：嚴重威脅，直接阻止自動跳轉

#### 使用者控制
- **手動開啟按鈕**：即使自動跳轉關閉，也可手動開啟 URL
- **視覺化警告**：彩色警告卡片清楚展示所有風險點
- **獨立開關控制**：SCAN 和 FILE 分頁各自獨立控制自動跳轉

------

## 🛠 技術棧 (Tech Stack)

本專案基於 [Plasmo Framework](https://docs.plasmo.com/) 建置，使用了以下技術：

- **Core**: Plasmo (Chrome Extension V3 Manifest)
- **UI Framework**: Vue 3 (Script Setup + Composition API)
- **Styling**: 自訂 CSS (復古雜誌風格)
- **Libraries**:
  - `jsqr`: 用於 QR Code 解碼
  - `qrcode.vue`: 用於 QR Code 生成
- **Architecture**: 元件化設計，程式碼重複使用率高

------

## 🚀 開發指南 (Getting Started)

### 1. 安裝相依套件

首先，確定你安裝了 Node.js 和套件管理器（推薦 pnpm）。

```bash
pnpm install
# or
npm install
```

### 2. 啟動開發伺服器

執行開發指令，Plasmo 會監聽檔案變更並自動重新建置。

```bash
pnpm dev
# or
npm run dev
```

> 如果遇到 `math-intrinsics` 相關錯誤，請將 `node_modules` 裡對應套件名稱的 `package.json` 中 `"main": false` 刪除或修改。

### 3. 載入到 Chrome

1. 開啟 Chrome 瀏覽器，前往 `chrome://extensions/`。
2. 開啟右上角的 **"開發人員模式" (Developer mode)**。
3. 點擊左上角的 **"載入未封裝項目" (Load unpacked)**。
4. 選擇本專案下的 `build/chrome-mv3-dev` 資料夾。

> **提示**：當你修改 `background.ts` 或 `manifest` 設定時，建議在擴充功能管理頁面點擊重新整理按鈕。修改 UI (`sidepanel.vue`) 通常會自動熱更新。

------

## 📦 打包發布 (Production Build)

當你準備發布擴充功能時，執行以下指令生成正式環境套件：

```bash
pnpm build
# or
npm run build
```

建置完成後，`build/chrome-mv3-prod` 資料夾內的內容即為可發布到 Chrome Web Store 的最終產物（通常需要壓縮為 .zip）。

------

## 📝 目錄結構說明

```
quick-qr/
├── assets/                          # 靜態資源（圖示等）
├── components/                      # Vue 元件
│   └── sidepanel-result-section.vue # 結果展示元件（重複使用）
├── contents/                        # Content Scripts
│   └── content-overlay.vue          # 截圖選取覆蓋層
├── lib/                            # 工具庫
│   └── generator.ts                # QR Code 生成邏輯
├── sidepanel.vue                   # 核心 UI（SCAN/FILE/MAKE）
├── popup.vue                       # 彈出視窗
├── background.ts                   # 背景服務（右鍵選單等）
├── readme/                         # 多語言文件
│   ├── README_zh.md               # 簡體中文文件
│   └── README_zh-TW.md            # 繁體中文文件
└── README.md                       # 專案文件（英文）
```

### 核心檔案說明

- **`sidepanel.vue`**: 主介面，包含三個分頁的邏輯、安全檢查系統、自動跳轉控制
- **`components/sidepanel-result-section.vue`**: 結果展示元件，包含安全警告顯示
- **`background.ts`**: 背景服務腳本，處理右鍵選單 (`contextMenus`) 事件
- **`contents/content-overlay.vue`**: 注入頁面的截圖選取元件

------

## 🔒 安全特性詳解

### 安全檢查流程

1. **掃描 QR Code** → 2. **解析 URL** → 3. **12 項安全檢查** → 4. **風險評級** → 5. **使用者決策**

### 範例情境

**情境 1：正常網站**
```
https://www.google.com
→ ✅ 無警告，開關開啟時直接跳轉
```

**情境 2：可疑網站**
```
https://login-verify.suspicious-site.tk
→ ⚠️ 顯示警告：高風險 TLD + 釣魚關鍵字
→ 開關開啟時彈出確認對話框
```

**情境 3：高危險網站**
```
https://paypal-secure.com
→ 🚨 品牌釣魚偵測觸發
→ 直接阻止自動跳轉，顯示紅色警告
```

------

## 🎨 設計理念

QuickQR 採用**復古雜誌風格 (Retro Magazine UI)**，靈感來自 20 世紀中期的印刷雜誌：

- **粗邊框 + 陰影**：營造紙質印刷的立體感
- **高對比度配色**：黃色主題 + 黑色邊框
- **字型排版**：大寫字母 + 緊湊佈局
- **互動回饋**：按鈕按下時的位移效果模擬實體按鍵

------

## 🤝 Credits

Presented by **RoLingG & Gemini**.

---

## 📄 License

MIT License - 自由使用，歡迎貢獻！
