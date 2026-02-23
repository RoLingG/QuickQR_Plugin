<template>
  <div class="magazine-container">
    <header class="header">
      <div class="logo-row">
        <h1 class="brand">Quick<span class="highlight">QR</span></h1>
        <span class="badge">VOL.02</span>
      </div>
      <p class="subtitle">Your digital Swiss Army Knife for QR codes</p>
    </header>

    <!-- 顶部 Tab 切换栏 -->
    <div class="tab-group">
      <button
          class="tab-btn"
          :class="{ active: activeTab === 'scan' }"
          @click="switchTab('scan')">
        SCAN
      </button>
      <button
          class="tab-btn"
          :class="{ active: activeTab === 'file' }"
          @click="switchTab('file')">
        FILE
      </button>
      <button
          class="tab-btn"
          :class="{ active: activeTab === 'make' }"
          @click="switchTab('make')">
        MAKE
      </button>
    </div>

    <main class="content">
      <!-- ================= SCAN 功能区域 ================= -->
      <div v-if="activeTab === 'scan'" class="tab-content">
        <div class="card-wrapper">
          <button
              @click="startCrop"
              :disabled="isProcessing"
              class="action-btn"
              :class="{ 'processing': isProcessing }">
            <div class="icon-box">
              <img v-if="!isProcessing" :src="screenCutUrl" alt="Scanner" class="scanner-icon" />
              <div v-else class="spinner"></div>
            </div>

            <div class="btn-text">
              <span class="btn-title">{{ isProcessing ? 'Processing...' : 'Capture Area' }}</span>
              <span class="btn-subtitle">CLICK TO SCAN SCREEN</span>
            </div>
          </button>
          <div class="card-shadow"></div>
        </div>

        <div class="status-bar">
          <div class="line"></div>
          <span class="status-text">{{ status }}</span>
          <div class="line"></div>
        </div>

        <!-- 自动跳转开关 -->
        <div class="settings-row">
          <div class="setting-item">
            <span class="setting-label">Auto Jump to URL</span>
            <button
              @click="toggleAutoJumpScan"
              class="toggle-btn"
              :class="{ 'active': autoJumpEnabledScan }">
              <span class="toggle-slider"></span>
            </button>
          </div>
          <p class="setting-hint">When enabled, automatically open URL in new tab after scanning</p>
        </div>

        <!-- 复用结果展示组件 -->
        <ResultSection
          v-if="qrResult"
          :qr-result="qrResult"
          type="SCAN"
          :url-security-warnings="urlSecurityWarnings"
          :url-risk-level="urlRiskLevel"
          :copy-text="copyText"
          :show-open-url="isValidUrl(qrResult)"
          @open-url="openUrl"
          @copy-text="copyToClipboard(qrResult)"
        />

        <div v-else class="empty-state">
          <div class="quote-mark">”</div>
          <p>No data captured yet.<br>Select an area or right-click an image.</p>
        </div>
      </div>

      <!-- ================= FILE 功能区域 ================= -->
      <div v-else-if="activeTab === 'file'" class="tab-content fade-in">
        <div class="drop-zone-wrapper"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="handleDrop"
            @click="triggerFileInput">
          <div class="drop-zone" :class="{ 'dragging': isDragging }">
            <div class="icon-box">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            </div>
            <div class="btn-text">
              <span class="btn-title">Upload Image</span>
              <span class="btn-subtitle">DRAG FILE OR CLICK</span>
            </div>
          </div>
          <!-- 阴影装饰 -->
          <div class="card-shadow"></div>

          <!-- 隐藏的 input -->
          <input ref="fileInputRef" type="file" accept="image/*" class="hidden" @change="handleFileSelect">
        </div>

        <div class="status-bar">
          <div class="line"></div>
          <span class="status-text">{{ status }}</span>
          <div class="line"></div>
        </div>

        <!-- 自动跳转开关 -->
        <div class="settings-row">
          <div class="setting-item">
            <span class="setting-label">Auto Jump to URL</span>
            <button
              @click="toggleAutoJumpFile"
              class="toggle-btn"
              :class="{ 'active': autoJumpEnabledFile }">
              <span class="toggle-slider"></span>
            </button>
          </div>
          <p class="setting-hint">When enabled, automatically open URL in new tab after scanning</p>
        </div>

        <ResultSection
          v-if="qrResult"
          :qr-result="qrResult"
          type="FILE"
          :url-security-warnings="urlSecurityWarnings"
          :url-risk-level="urlRiskLevel"
          :copy-text="copyText"
          :show-open-url="isValidUrl(qrResult)"
          @open-url="openUrl"
          @copy-text="copyToClipboard(qrResult)"
        />

        <div v-else class="empty-state">
          <div class="quote-mark">Folder</div>
          <p>Drag local image here<br>to decode QR code.</p>
        </div>
      </div>

      <!-- ================= MAKE 功能区域 ================= -->
      <div v-else class="tab-content fade-in">
        <div class="input-section">
          <label class="section-label">INPUT CONTENT</label>
          <textarea v-model="genText" class="gen-input" placeholder="Type text or right-click selected text on web page..."></textarea>
        </div>
        <!-- 二维码展示区 -->
        <div class="qr-display-wrapper" v-if="genText">
          <div class="qr-frame">
            <qrcode-vue
                :value="genText"
                :size="160"
                level="M"
                render-as="svg"
                background="#ffffff"
                foreground="#1c1917"/>
          </div>
          <p class="qr-caption">SCAN WITH PHONE</p>
        </div>

        <div v-else class="empty-state">
          <div class="quote-mark">#</div>
          <p>Waiting for input.<br>Enter text above to generate QR.</p>
        </div>
      </div>
    </main>

    <footer class="footer">
      Presented by RoLingG & Gemini
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue"
import jsQR from "jsqr"
import QrcodeVue from "qrcode.vue"
import screenCutUrl from './assets/screen_cut.svg'
import ResultSection from './components/sidepanel-result-section.vue'

const activeTab = ref<'scan' | 'file' | 'make'>('scan')
const status = ref("Ready")
const qrResult = ref("")
const isProcessing = ref(false)
const copyText = ref("COPY TEXT")
const isCropping = ref(false)
const isDragging = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)
const genText = ref("")
const autoJumpEnabledScan = ref(false) // SCAN 标签页自动跳转开关
const autoJumpEnabledFile = ref(false) // FILE 标签页自动跳转开关
const urlSecurityWarnings = ref<string[]>([]) // URL 安全警告
const urlRiskLevel = ref<'low' | 'medium' | 'high'>('low') // URL 风险等级

const switchTab = (tab: 'scan' | 'file' | 'make') => {
  activeTab.value = tab
  // 切换 tab 时清空之前的状态，体验更好
  status.value = "Ready"
  qrResult.value = ""
  isProcessing.value = false
  urlSecurityWarnings.value = []
  urlRiskLevel.value = 'low'
}

const handleMessage = (message: any) => {
  if (message.type === "CROP_RESULT") {
    activeTab.value = 'scan'
    status.value = "Processing..."
    processCrop(message.area)
  }
  else if (message.type === "QR_SCAN_REQUEST") {
    activeTab.value = 'scan'
    handleImageScan(message.srcUrl)
  }
  else if (message.type === "QR_GENERATE_REQUEST") {
    activeTab.value = 'make'
    genText.value = message.text
  }
}

const copyToClipboard = (text: string) => {
  if(!text) return
  navigator.clipboard.writeText(text)
  copyText.value = "COPIED!"
  setTimeout(() => copyText.value = "COPY TEXT", 2000)
}

const openUrl = () => {
  if (qrResult.value && isValidUrl(qrResult.value)) {
    chrome.tabs.create({ url: qrResult.value })
  }
}

const startCrop = async () => {
  try {
    isCropping.value = true
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    if (tab?.id) {
      status.value = "Waiting for Selection..."
      qrResult.value = ""
      isProcessing.value = true
      await chrome.tabs.sendMessage(tab.id, { type: "START_CROP" })
    }
  } catch (err) {
    console.error(err)
    status.value = "Error: Cannot access page"
    isProcessing.value = false
  }
}

const processCrop = (area: any) => {
  chrome.tabs.captureVisibleTab({ format: "png" }, (dataUrl) => {
    isCropping.value = false
    if (!dataUrl) {
      status.value = "Capture Failed"; isProcessing.value = false; return
    }
    scanImageFromUrl(dataUrl, area, 'scan')
  })
}

const handleImageScan = (url: string) => {
  status.value = "Downloading Image..."
  isProcessing.value = true
  qrResult.value = ""
  scanImageFromUrl(url, null)
}

// --- Local File ---
const triggerFileInput = () => fileInputRef.value?.click()

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    processLocalFile(input.files[0])
  }
  input.value = '' // reset
}

const handleDrop = (event: DragEvent) => {
  isDragging.value = false
  const files = event.dataTransfer?.files
  if (files && files[0]) {
    processLocalFile(files[0])
  }
}

const processLocalFile = (file: File) => {
  if (!file.type.startsWith('image/')) {
    status.value = "Error: Not an Image"
    return
  }

  status.value = "Reading File..."
  isProcessing.value = true
  qrResult.value = ""

  const reader = new FileReader()
  reader.onload = (e) => {
    if (e.target?.result) {
      // 直接复用已有的核心扫描函数！
      scanImageFromUrl(e.target.result as string, null, 'file')
    }
  }
  reader.onerror = () => {
    status.value = "Error Reading File"
    isProcessing.value = false
  }
  reader.readAsDataURL(file)
}

const scanImageFromUrl = (url: string, cropArea: any = null, source: 'scan' | 'file' = 'scan') => {
  const image = new Image()
  image.crossOrigin = "Anonymous"

  image.onload = () => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    if (cropArea) {
      canvas.width = cropArea.width
      canvas.height = cropArea.height
      ctx.drawImage(image, cropArea.x, cropArea.y, cropArea.width, cropArea.height, 0, 0, cropArea.width, cropArea.height)
    } else {
      canvas.width = image.width
      canvas.height = image.height
      ctx.drawImage(image, 0, 0)
    }

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const code = jsQR(imageData.data, imageData.width, imageData.height)

    isProcessing.value = false
    if (code) {
      qrResult.value = code.data
      status.value = "Scan Complete"

      // 如果结果是 URL，进行安全检查
      if (isValidUrl(code.data)) {
        const securityCheck = checkUrlSecurity(code.data)
        urlSecurityWarnings.value = securityCheck.warnings
        urlRiskLevel.value = securityCheck.riskLevel

        // 根据来源选择对应的开关
        const autoJumpEnabled = source === 'scan' ? autoJumpEnabledScan.value : autoJumpEnabledFile.value

        // 如果开关打开，根据风险等级决定是否跳转
        if (autoJumpEnabled) {
          // 高风险 URL：阻止自动跳转
          if (securityCheck.riskLevel === 'high') {
            status.value = "⚠️ High-risk URL detected - Auto-jump blocked"
            return
          }

          // 中低风险：显示确认对话框
          const warningText = securityCheck.warnings.length > 0
            ? '\n\nSecurity warnings:\n' + securityCheck.warnings.join('\n')
            : ''

          const confirmed = confirm(
            `Auto-jump is enabled. Open this URL in a new tab?\n\n${code.data}${warningText}\n\nClick OK to open, Cancel to stay.`
          )

          if (confirmed) {
            chrome.tabs.create({ url: code.data })
          }
        }
      } else {
        // 清空之前的警告
        urlSecurityWarnings.value = []
        urlRiskLevel.value = 'low'
      }
    } else {
      status.value = "No QR Code Found"
    }
  }
  image.onerror = () => {
    isProcessing.value = false
    status.value = "Error Loading Image"
  }
  image.src = url
}

// 判断是否为有效 URL
const isValidUrl = (str: string): boolean => {
  try {
    const url = new URL(str)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

// URL 安全检查
interface SecurityCheck {
  isSafe: boolean
  warnings: string[]
  riskLevel: 'low' | 'medium' | 'high'
}

// 检查 URL 安全性
const checkUrlSecurity = (urlString: string): SecurityCheck => {
  const warnings: string[] = []
  let riskLevel: 'low' | 'medium' | 'high' = 'low'

  try {
    const url = new URL(urlString)

    // 检查 HTTP vs HTTPS
    if (url.protocol === 'http:') {
      warnings.push('⚠️ URL uses insecure HTTP protocol (not HTTPS)')
      if (riskLevel === 'low') riskLevel = 'medium'
    }

    // 检查是否使用 IP 地址而非域名
    const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/
    if (ipPattern.test(url.hostname)) {
      warnings.push('⚠️ URL uses IP address instead of domain name')
      if (riskLevel === 'low') riskLevel = 'medium'
    }

    // 检查 URL 长度（钓鱼网站常用超长 URL 混淆）
    if (urlString.length > 200) {
      warnings.push('⚠️ URL is unusually long')
      if (riskLevel === 'low') riskLevel = 'medium'
    }

    // 检查可疑的顶级域名
    const suspiciousTlds = ['.tk', '.ml', '.ga', '.cf', '.gq', '.xyz', '.top', '.work']
    if (suspiciousTlds.some(tld => url.hostname.endsWith(tld))) {
      warnings.push('⚠️ Domain uses a high-risk TLD')
      if (riskLevel === 'low') riskLevel = 'medium'
    }

    // 检查域名中是否有过多的子域名（可能是钓鱼）
    const subdomains = url.hostname.split('.')
    if (subdomains.length > 4) {
      warnings.push('⚠️ URL has many subdomains')
      if (riskLevel === 'low') riskLevel = 'medium'
    }

    // 检查是否包含常见的钓鱼关键词
    const phishingKeywords = ['login', 'signin', 'account', 'verify', 'secure', 'update', 'confirm']
    const pathAndQuery = url.pathname + url.search
    const hasPhishingKeyword = phishingKeywords.some(keyword =>
        pathAndQuery.toLowerCase().includes(keyword)
    )
    if (hasPhishingKeyword && !url.hostname.includes('google') && !url.hostname.includes('microsoft')) {
      warnings.push('⚠️ URL contains authentication-related keywords')
      if (riskLevel === 'low') riskLevel = 'medium'
    }

    // 检查是否使用非标准端口
    if (url.port && url.port !== '80' && url.port !== '443') {
      warnings.push('⚠️ URL uses non-standard port')
      if (riskLevel === 'low') riskLevel = 'medium'
    }

    // 检测同形字攻击（数字/字母混淆）
    const homographPatterns = [
      { pattern: /[0oO]{2,}/, desc: 'contains confusing O/0 characters' },
      { pattern: /[1lI]{2,}/, desc: 'contains confusing 1/l/I characters' },
      { pattern: /[5S]{2,}/, desc: 'contains confusing 5/S characters' },
      { pattern: /rn/g, desc: 'contains "rn" that looks like "m"' }
    ]

    for (const { pattern, desc } of homographPatterns) {
      if (pattern.test(url.hostname)) {
        warnings.push(`⚠️ Domain ${desc} (possible homograph attack)`)
        if (riskLevel === 'low') riskLevel = 'medium'
        break
      }
    }

    // 检测短链接服务
    const shortLinkDomains = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'is.gd', 'buff.ly', 'adf.ly', 'short.link']
    if (shortLinkDomains.some(domain => url.hostname === domain || url.hostname.endsWith('.' + domain))) {
      warnings.push('⚠️ URL is a short link (cannot verify final destination)')
      if (riskLevel === 'low') riskLevel = 'medium'
    }

    // 检测常见品牌钓鱼
    const brandKeywords = ['paypal', 'amazon', 'apple', 'microsoft', 'google', 'facebook', 'instagram', 'twitter', 'netflix', 'bank', 'visa', 'mastercard']
    const officialDomains = ['paypal.com', 'amazon.com', 'apple.com', 'microsoft.com', 'google.com', 'facebook.com', 'instagram.com', 'twitter.com', 'netflix.com']

    const hostname = url.hostname.toLowerCase()
    const hasBrandKeyword = brandKeywords.some(brand => hostname.includes(brand))
    const isOfficialDomain = officialDomains.some(domain => hostname === domain || hostname.endsWith('.' + domain))

    if (hasBrandKeyword && !isOfficialDomain) {
      warnings.push('🚨 Domain contains brand name but is not official (possible phishing)')
      riskLevel = 'high'
    }

    // 检查是否包含多个 @ 符号（常见钓鱼手法）
    if ((urlString.match(/@/g) || []).length > 1) {
      warnings.push('🚨 URL contains multiple @ symbols (phishing indicator)')
      riskLevel = 'high'
    }

    // 检查是否包含 URL 编码的特殊字符（可能隐藏恶意内容）
    if (urlString.includes('%00') || urlString.includes('%0d') || urlString.includes('%0a')) {
      warnings.push('🚨 URL contains suspicious encoded characters')
      riskLevel = 'high'
    }

    return {
      isSafe: riskLevel !== 'high',
      warnings,
      riskLevel
    }
  } catch {
    return {
      isSafe: false,
      warnings: ['🚨 Invalid URL format'],
      riskLevel: 'high'
    }
  }
}

// 切换 SCAN 标签页自动跳转开关
const toggleAutoJumpScan = () => {
  autoJumpEnabledScan.value = !autoJumpEnabledScan.value
  chrome.storage.local.set({ autoJumpEnabledScan: autoJumpEnabledScan.value })
}

// 切换 FILE 标签页自动跳转开关
const toggleAutoJumpFile = () => {
  autoJumpEnabledFile.value = !autoJumpEnabledFile.value
  chrome.storage.local.set({ autoJumpEnabledFile: autoJumpEnabledFile.value })
}

// --- Lifecycle ---
onMounted(() => {
  chrome.runtime.onMessage.addListener(handleMessage)
  // 加载保存的开关状态
  chrome.storage.local.get(['autoJumpEnabledScan', 'autoJumpEnabledFile'], (result) => {
    if (result.autoJumpEnabledScan !== undefined) {
      autoJumpEnabledScan.value = result.autoJumpEnabledScan
    }
    if (result.autoJumpEnabledFile !== undefined) {
      autoJumpEnabledFile.value = result.autoJumpEnabledFile
    }
  })
})
onUnmounted(() => {
  chrome.runtime.onMessage.removeListener(handleMessage)
})
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.magazine-container {
  --rh-primary: #bdbd64;
  --rh-dim: #9BC4CC;
  --rh-accent: #D4AF85;
  --rh-bg-light: #F5F5E0;
  --bg-color: var(--rh-bg-light);
  --text-primary: #1c1917;
  --text-secondary: #57534e;
  --accent-color: var(--rh-primary);
  --card-bg: #ffffff;
  --border-color: #1c1917;

  width: 100%;
  min-height: 100vh;
  background-color: var(--bg-color);
  color: var(--text-primary);
  display: flex;
  flex-direction: column;
  padding: 0;
  font-weight: 700;
}

.header {
  padding: 20px 24px;
  border-bottom: 2px solid var(--border-color);
  background: var(--rh-primary);
}

.logo-row { display: flex; justify-content: space-between; align-items: baseline; }
.brand { font-size: 32px; font-weight: 900; margin: 0; }
.highlight { color: white; text-shadow: 2px 2px 0 var(--border-color); }
.badge { font-size: 10px; font-weight: 800; letter-spacing: 1px; color: var(--bg-color); background: var(--border-color); padding: 2px 6px; border: 1px solid var(--border-color); }
.subtitle { margin-top: 6px; font-size: 12px; opacity: 0.7; }

.tab-group {
  display: flex;
  border-bottom: 2px solid var(--border-color);
}
.tab-btn { flex: 1; border: none; background: var(--bg-color); padding: 12px; font-family: inherit; font-weight: 800; font-size: 14px; letter-spacing: 1px; cursor: pointer; color: var(--text-secondary); border-right: 2px solid var(--border-color); transition: all 0.2s; }
.tab-btn:last-child { border-right: none; }
.tab-btn:hover { background: #fff; }
.tab-btn.active {
  background: var(--text-primary);
  color: var(--bg-color);
  box-shadow: inset 0 -4px 0 var(--rh-accent);
}

.content { flex: 1; padding: 24px; display: flex; flex-direction: column; gap: 24px; }
.tab-content { display: flex; flex-direction: column; gap: 24px; animation: fadeIn 0.3s ease; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

.card-wrapper, .drop-zone-wrapper { position: relative; height: 140px; }

.action-btn {
  position: relative; z-index: 10; width: 100%; height: 100%; background: var(--card-bg); border: 3px solid var(--text-primary); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; cursor: pointer; transition: transform 0.1s ease; }
.card-shadow { position: absolute; top: 8px; left: 8px; width: 100%; height: 100%; background-color: var(--rh-dim); border: 3px solid var(--text-primary); z-index: 0; }

.drop-zone { position: relative; z-index: 10; width: 100%; height: 100%; background: var(--card-bg); border: 3px solid var(--text-primary); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; cursor: pointer; transition: all 0.2s ease; }
.drop-zone.dragging, .drop-zone:hover {background-color: #fffef0;transform: translate(-2px, -2px);}

.action-btn:hover {transform: translate(-2px, -2px);background-color: #fffef0;}
.action-btn:active {transform: translate(4px, 4px);}

.icon-box { width: 48px; height: 48px; background-color: var(--rh-bg-light); border: 2px solid var(--border-color); display: flex; align-items: center; justify-content: center; }
.btn-title { font-size: 18px; font-weight: 800; display: block; }
.btn-subtitle { font-size: 10px; font-weight: 700; letter-spacing: 1px; color: var(--text-secondary); }
.spinner { width: 20px; height: 20px; border: 3px solid var(--border-color); border-top-color: transparent; border-radius: 50%; animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.hidden { display: none; }

.status-bar { display: flex; align-items: center; gap: 12px; }
.line { flex: 1; height: 2px; background-color: var(--border-color); }
.status-text { font-size: 11px; font-weight: 800; text-transform: uppercase; color: var(--bg-color); background: var(--border-color); padding: 2px 6px; }

/* === 设置开关样式 === */
.settings-row {
  background: white;
  border: 2px solid var(--border-color);
  padding: 12px 16px;
  border-left: 4px solid var(--rh-primary);
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.setting-label {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-primary);
}

.setting-hint {
  margin: 6px 0 0 0;
  font-size: 10px;
  font-weight: 600;
  color: var(--text-secondary);
  line-height: 1.4;
}

.toggle-btn {
  position: relative;
  width: 44px;
  height: 24px;
  background: #d1d5db;
  border: 2px solid var(--border-color);
  cursor: pointer;
  transition: background 0.2s;
  padding: 0;
}

.toggle-btn.active {
  background: var(--rh-primary);
}

.toggle-slider {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  background: white;
  border: 2px solid var(--border-color);
  transition: transform 0.2s;
}

.toggle-btn.active .toggle-slider {
  transform: translateX(20px);
}

/* === MAKE 样式 === */
.input-section { display: flex; flex-direction: column; gap: 8px; }
.section-label { font-size: 10px; font-weight: 800; color: var(--text-secondary); letter-spacing: 1px; text-transform: uppercase; }
.gen-input { width: 100%; min-height: 80px; padding: 12px; border: 2px solid var(--border-color); background: white; font-family: inherit; font-size: 13px; font-weight: 600; resize: vertical; outline: none; border-radius: 0; box-shadow: 4px 4px 0 var(--rh-dim); }
.gen-input:focus { border-color: var(--rh-primary); }

.qr-display-wrapper { display: flex; flex-direction: column; align-items: center; gap: 12px; margin-top: 10px; animation: slideUp 0.3s ease-out; }
@keyframes slideUp { from { transform: translateY(10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
.qr-frame { background: white; padding: 16px; border: 3px solid var(--text-primary); box-shadow: 8px 8px 0 var(--rh-accent); }
.qr-caption { font-size: 10px; color: var(--text-secondary); letter-spacing: 2px; margin: 0; }

.empty-state { text-align: center; margin-top: 20px; }
.quote-mark { font-size: 40px; line-height: 1; color: var(--rh-dim); font-weight: 900; }
.empty-state p { font-size: 12px; color: var(--rh-dim); margin-top: 0; }

.footer { text-align: center; padding: 20px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; background: var(--rh-accent); color: var(--text-primary); border-top: 2px solid var(--border-color); margin-top: auto; }
</style>
