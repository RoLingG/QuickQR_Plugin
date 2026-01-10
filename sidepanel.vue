<template>
  <div class="magazine-container">
    <header class="header">
      <div class="logo-row">
        <h1 class="brand">Quick<span class="highlight">QR</span></h1>
        <span class="badge">VOL.01</span>
      </div>
      <p class="subtitle">Your digital Swiss Army Knife for QR codes</p>
    </header>

    <!-- 顶部 Tab 切换栏 (增加 FILE) -->
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
      <!-- ================= 1. SCAN 功能区域 ================= -->
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

        <!-- 复用结果展示组件 -->
        <div v-if="qrResult" class="result-section">
          <div class="result-header">
            <h3>Result.</h3>
            <button @click="copyToClipboard(qrResult)" class="copy-link">{{ copyText }}</button>
          </div>
          <div class="result-card">
            <textarea readonly class="result-content">{{ qrResult }}</textarea>
            <div class="result-footer">
              <span>TYPE: SCREEN</span>
              <span>{{ new Date().toLocaleTimeString() }}</span>
            </div>
          </div>
        </div>

        <div v-else class="empty-state">
          <div class="quote-mark">”</div>
          <p>No data captured yet.<br>Select an area or right-click an image.</p>
        </div>
      </div>

      <!-- ================= 2. FILE 功能区域 (新增) ================= -->
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
        <div v-if="qrResult" class="result-section">
          <div class="result-header">
            <h3>Result.</h3>
            <button @click="copyToClipboard(qrResult)" class="copy-link">{{ copyText }}</button>
          </div>
          <div class="result-card">
            <textarea readonly class="result-content">{{ qrResult }}</textarea>
            <div class="result-footer">
              <span>TYPE: FILE</span>
              <span>{{ new Date().toLocaleTimeString() }}</span>
            </div>
          </div>
        </div>

        <div v-else class="empty-state">
          <div class="quote-mark">Folder</div>
          <p>Drag local image here<br>to decode QR code.</p>
        </div>
      </div>

      <!-- ================= 3. MAKE 功能区域 ================= -->
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

const activeTab = ref<'scan' | 'file' | 'make'>('scan')
const status = ref("Ready")
const qrResult = ref("")
const isProcessing = ref(false)
const copyText = ref("COPY TEXT")
const isCropping = ref(false)
const isDragging = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)
const genText = ref("")

const switchTab = (tab: 'scan' | 'file' | 'make') => {
  activeTab.value = tab
  // 切换 tab 时清空之前的状态，体验更好
  status.value = "Ready"
  qrResult.value = ""
  isProcessing.value = false
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
    scanImageFromUrl(dataUrl, area)
  })
}

const handleImageScan = (url: string) => {
  status.value = "Downloading Image..."
  isProcessing.value = true
  qrResult.value = ""
  scanImageFromUrl(url, null)
}

// --- Logic 2: Local File (新增) ---
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
      scanImageFromUrl(e.target.result as string, null)
    }
  }
  reader.onerror = () => {
    status.value = "Error Reading File"
    isProcessing.value = false
  }
  reader.readAsDataURL(file)
}

const scanImageFromUrl = (url: string, cropArea: any = null) => {
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

// --- Lifecycle ---
onMounted(() => {
  chrome.runtime.onMessage.addListener(handleMessage)
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

/* === MAKE 样式 === */
.input-section { display: flex; flex-direction: column; gap: 8px; }
.section-label { font-size: 10px; font-weight: 800; color: var(--text-secondary); letter-spacing: 1px; text-transform: uppercase; }
.gen-input { width: 100%; min-height: 80px; padding: 12px; border: 2px solid var(--border-color); background: white; font-family: inherit; font-size: 13px; font-weight: 600; resize: vertical; outline: none; border-radius: 0; box-shadow: 4px 4px 0 var(--rh-dim); }
.gen-input:focus { border-color: var(--rh-primary); }

.qr-display-wrapper { display: flex; flex-direction: column; align-items: center; gap: 12px; margin-top: 10px; animation: slideUp 0.3s ease-out; }
@keyframes slideUp { from { transform: translateY(10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
.qr-frame { background: white; padding: 16px; border: 3px solid var(--text-primary); box-shadow: 8px 8px 0 var(--rh-accent); }
.qr-caption { font-size: 10px; color: var(--text-secondary); letter-spacing: 2px; margin: 0; }

/* === 结果通用样式 === */
.result-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 8px; }
.result-header h3 { font-size: 16px; font-weight: 800; margin: 0; }
.copy-link { background: none; border: none; font-family: inherit; font-size: 10px; font-weight: 800; color: var(--accent-color); cursor: pointer; text-decoration: underline; text-underline-offset: 4px; }
.result-card { background: white; border: 2px solid var(--border-color); padding: 16px; border-left: 6px solid var(--rh-accent); box-shadow: 4px 4px 0 rgba(0,0,0,0.1); }
.result-content { width: 100%; border: none; resize: none; font-family: inherit; font-size: 12px; font-weight: 600; color: var(--text-primary); outline: none; height: auto; min-height: 60px; }
.result-footer { margin-top: 12px; padding-top: 12px; border-top: 2px dashed #ccc; display: flex; justify-content: space-between; font-size: 10px; color: var(--text-secondary); }

.empty-state { text-align: center; margin-top: 20px; }
.quote-mark { font-size: 40px; line-height: 1; color: var(--rh-dim); font-weight: 900; }
.empty-state p { font-size: 12px; color: var(--rh-dim); margin-top: 0; }

.footer { text-align: center; padding: 20px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; background: var(--rh-accent); color: var(--text-primary); border-top: 2px solid var(--border-color); margin-top: auto; }
</style>
