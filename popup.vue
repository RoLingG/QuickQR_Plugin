<template>
  <div class="magazine-container">
    <header class="header">
      <div class="logo-row">
        <h1 class="brand">Quick<span class="highlight">QR</span></h1>
        <span class="badge">GEN</span>
      </div>
      <p class="subtitle">QR Code Generator</p>
    </header>

    <main class="content">
      <!-- 1. 二维码展示区 -->
      <div class="frame-wrapper">
        <div class="qr-frame">
          <canvas v-show="text" ref="canvasRef" class="qr-canvas"></canvas>
          <div v-if="!text" class="empty-placeholder">
            <span class="empty-text">Enter text to generate</span>
          </div>
        </div>
        <div class="frame-shadow"></div>
      </div>

      <div class="input-group">
        <label class="label-text">CONTENT SOURCE</label>
        <input v-model="text" type="text" class="text-input" placeholder="https://example.com"/>
      </div>

      <div class="controls-grid">
        <div class="control-item color-item">
          <label class="label-text">FG COLOR</label>
          <div class="color-picker-wrapper" :style="{ backgroundColor: fgColor }">
            <input type="color" v-model="fgColor" class="color-input" />
          </div>
        </div>

        <div class="control-item color-item">
          <label class="label-text">BG COLOR</label>
          <div class="color-picker-wrapper border-mode" :style="{ backgroundColor: bgColor }">
            <input type="color" v-model="bgColor" class="color-input" />
          </div>
        </div>

        <div class="control-item logo-item">
          <label class="label-text">LOGO</label>
          <input type="file"
              ref="fileInputRef"
              accept="image/*"
              class="hidden-input"
              @change="handleFileUpload"/>

          <div class="logo-upload-box"
              :class="{ 'has-image': logoSrc }"
              @click="triggerUpload"
              title="Upload Logo">

            <img v-if="logoSrc" :src="logoSrc" class="logo-preview"  alt=""/>
            <span v-else class="upload-icon">+</span>

            <button v-if="logoSrc"
                class="remove-logo-btn"
                @click.stop="removeLogo"
                title="Remove Logo">
              ×
            </button>
          </div>
        </div>
      </div>

      <!-- 4. 操作按钮 -->
      <div class="actions">
        <button @click="download('png')" class="btn primary-btn">
          <span>SAVE PNG</span>
        </button>
        <!-- 打开侧边栏按钮 -->
        <button @click="openSidePanel" class="btn secondary-btn" title="Open Scanner">
          <img :src="screenCutUrl" alt="Scanner" class="scanner-icon" />
        </button>
      </div>
    </main>

    <footer class="footer">
      Vol.01 — Presented by RoLingG & Gemini
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { generateQRToCanvas } from '~/lib/generator'
import screenCutUrl from './assets/screen_cut.svg'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null) // 新增：文件输入框引用
const text = ref('')
const fgColor = ref('#1c1917')
const bgColor = ref('#ffffff')
const logoSrc = ref<string | null>(null) // 新增：存储Logo数据

// 初始化
onMounted(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]?.url) {
      text.value = tabs[0].url
    }
  })
})

// 处理文件上传
const handleFileUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    logoSrc.value = e.target?.result as string
    console.log('Logo uploaded:', e.target?.result as string)
    if (fileInputRef.value) fileInputRef.value.value = ''
  }
  reader.readAsDataURL(file)
}

const triggerUpload = () => {
  fileInputRef.value?.click()
}

const removeLogo = () => {
  logoSrc.value = null
}

// 监听变化重绘 (修改：加入 logoSrc 监听)
watch([text, fgColor, bgColor, logoSrc], () => {
  if (canvasRef.value && text.value) {
    generateQRToCanvas(canvasRef.value, {
      text: text.value,
      fgColor: fgColor.value,
      bgColor: bgColor.value,
      logoUrl: logoSrc.value || undefined // 传给 generator
    })
  }
})

// 下载
const download = (format: 'png' | 'jpeg') => {
  if (!canvasRef.value) return
  const link = document.createElement('a')
  link.download = `quickqr-${Date.now()}.${format}`
  link.href = canvasRef.value.toDataURL(`image/${format}`)
  link.click()
}

// 打开侧边栏
const openSidePanel = async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  if (tab && tab.windowId) {
    // @ts-ignore
    await chrome.sidePanel.open({ windowId: tab.windowId })
    window.close()
  }
}
</script>

<style scoped>
.magazine-container {
  --rh-primary: #bdbd64;
  --rh-dim: #9BC4CC;
  --rh-accent: #D4AF85;
  --rh-bg-light: #F5F5E0;

  --bg-color: var(--rh-bg-light);
  --text-primary: #1c1917;
  --text-secondary: #57534e;
  --accent-color: var(--rh-primary);
  --border-color: #1c1917;
  --shadow-color: var(--rh-dim);

  width: 320px;
  min-height: 480px;
  background-color: var(--bg-color);
  color: var(--text-primary);

  font-weight: 700;
  display: flex;
  flex-direction: column;
}

* { box-sizing: border-box; }


.header {
  padding: 20px 24px;
  border-bottom: 2px solid var(--border-color);
  background: var(--rh-primary);
}

.logo-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.brand {
  font-family: inherit;
  font-size: 32px;
  font-weight: 900;
  margin: 0;
}

.highlight {
  color: white;
  text-shadow: 2px 2px 0 var(--border-color);
}

.badge {
  font-size: 10px;
  font-weight: 800;
  color: var(--text-primary);
  border: 2px solid var(--text-primary);
  padding: 2px 4px;
  background: white;
}

.subtitle {
  margin: 4px 0 0 0;
  font-family: inherit;
  font-size: 11px;
  color: var(--text-secondary);
  font-weight: 600;
}

.content {
  padding: 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.frame-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  margin-bottom: 8px;
}

.qr-frame {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  border: 3px solid var(--text-primary);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: transform 0.2s ease;
  background-color: white;
}

.qr-canvas {
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
  image-rendering: pixelated;
}

.frame-shadow {
  position: absolute;
  top: 8px;
  left: 8px;
  width: 100%;
  height: 100%;
  background-color: var(--shadow-color);
  border-radius: 8px;
  z-index: 1;
  border: 2px solid var(--text-primary);
}

.empty-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: 100%;
  background-color: white;
  background-image: radial-gradient(var(--rh-dim) 1px, transparent 1px);
  background-size: 10px 10px;
}

.empty-text {
  font-family: inherit;
  font-weight: 700;
  font-size: 12px;
  color: var(--rh-dim);
}

.label-text {
  display: block;
  font-size: 10px;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 6px;
  text-transform: uppercase;
}

.text-input {
  width: 100%;
  padding: 10px;
  background: white;
  border: 2px solid var(--border-color);
  border-radius: 4px;
  font-family: inherit;
  font-weight: 700;
  font-size: 12px;
  color: var(--text-primary);
  outline: none;
  transition: border-color 0.2s;
  box-shadow: 2px 2px 0 rgba(0,0,0,0.05);
}

.text-input:focus {
  border-color: var(--accent-color);
  background-color: #fffef0;
}

.controls-grid {
  display: flex;
  gap: 12px;
  align-items: flex-end;
}

.control-item {
  display: flex;
  flex-direction: column;
}

.color-item {
  flex: 1;
}

.logo-item {
  width: 44px;
  flex-shrink: 0;
}

.color-picker-wrapper {
  width: 100%;
  height: 36px;
  border-radius: 4px;
  border: 2px solid var(--border-color);
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.color-input {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  padding: 0;
  margin: 0;
  cursor: pointer;
  opacity: 0;
}


.hidden-input { display: none; }

.logo-upload-box {
  width: 44px;
  height: 36px;
  border: 2px dashed var(--border-color);
  border-radius: 4px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  transition: all 0.2s;
}

.logo-upload-box:hover {
  background: #fffef0;
  border-color: var(--rh-primary);
}

.logo-upload-box.has-image {
  border-style: solid;
  padding: 2px;
}

.upload-icon {
  font-size: 18px;
  color: var(--text-secondary);
  line-height: 1;
}

.logo-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 2px;
}

.remove-logo-btn {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 16px;
  height: 16px;
  background: var(--text-primary);
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 12px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  box-shadow: 1px 1px 0 rgba(0,0,0,0.2);
}

.remove-logo-btn:hover {
  background: #d32f2f;
}

.actions {
  display: flex;
  gap: 8px;
  margin-top: auto;
}

.btn {
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  font-weight: 800;
  font-size: 12px;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.1s;
  border: 2px solid var(--text-primary);
  box-shadow: 2px 2px 0 var(--text-primary);
}

.primary-btn {
  flex: 1;
  background: var(--text-primary);
  color: var(--rh-bg-light);
}

.primary-btn:hover {
  background: #000;
  transform: translate(-1px, -1px);
  box-shadow: 4px 4px 0 var(--rh-primary);
}

.primary-btn:active {
  transform: translate(1px, 1px);
  box-shadow: 1px 1px 0 var(--rh-primary);
}

.secondary-btn {
  width: 44px;
  background: white;
  color: var(--text-primary);
}

.secondary-btn:hover {
  background: #fffef0;
  box-shadow: 3px 3px 0 var(--rh-dim);
  transform: translate(-1px, -1px);
}

.scanner-icon {
  width: 24px;
  height: 24px;
  display: block;
}

.footer {
  text-align: center;
  padding: 16px;
  font-size: 10px;
  font-weight: 700;
  border-top: 2px solid var(--border-color);
  text-transform: uppercase;
  background: var(--rh-accent);
  color: var(--text-primary);
}
</style>