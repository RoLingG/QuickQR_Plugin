<template>
  <div v-if="isActive" class="crop-container" @mousedown="handleMouseDown"
       @mousemove="handleMouseMove" @mouseup="handleMouseUp">
    <div class="tip-box">
      按住鼠标左键拖拽选区
    </div>

    <div v-if="boxStyle" :style="boxStyle" class="selection-box"></div>
  </div>
</template>

<script lang="ts">
import type { PlasmoCSConfig } from "plasmo"

// 1. Plasmo 配置：注入到所有页面
export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}
</script>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue"

// 状态定义
const isActive = ref(false)
const isDragging = ref(false)
const startPos = ref<{ x: number, y: number } | null>(null)
const currentPos = ref<{ x: number, y: number } | null>(null)

// 2. 监听来自 sidePanel 的消息
onMounted(() => {
  chrome.runtime.onMessage.addListener(messageListener)
})

onUnmounted(() => {
  chrome.runtime.onMessage.removeListener(messageListener)
})

const messageListener = (msg: any) => {
  if (msg.type === "START_CROP") {
    isActive.value = true
    document.body.style.cursor = "crosshair" // 鼠标变十字
  }
}

// 3. 鼠标交互逻辑
const handleMouseDown = (e: MouseEvent) => {
  e.preventDefault()
  isDragging.value = true
  startPos.value = { x: e.clientX, y: e.clientY }
  currentPos.value = { x: e.clientX, y: e.clientY }
}

const handleMouseMove = (e: MouseEvent) => {
  if (!isDragging.value) return
  e.preventDefault()
  currentPos.value = { x: e.clientX, y: e.clientY }
}

const handleMouseUp = () => {
  if (!isDragging.value || !startPos.value || !currentPos.value) return
  isDragging.value = false

  // 计算最终坐标和宽高
  const x = Math.min(startPos.value.x, currentPos.value.x)
  const y = Math.min(startPos.value.y, currentPos.value.y)
  const width = Math.abs(currentPos.value.x - startPos.value.x)
  const height = Math.abs(currentPos.value.y - startPos.value.y)

  // 防止误触（选区太小）
  if (width > 10 && height > 10) {
    // 发送坐标回 Sidepanel
    // 注意：一定要乘以 devicePixelRatio，否则高清屏截图会偏
    const dpr = window.devicePixelRatio || 1
    chrome.runtime.sendMessage({
      type: "CROP_RESULT",
      area: {
        x: x * dpr,
        y: y * dpr,
        width: width * dpr,
        height: height * dpr
      }
    })
  }

  // 重置并关闭遮罩
  reset()
}

const reset = () => {
  isActive.value = false
  startPos.value = null
  currentPos.value = null
  document.body.style.cursor = "default"
}

// 4. 计算属性：动态计算选区的 CSS
const boxStyle = computed(() => {
  if (!startPos.value || !currentPos.value) return null

  const left = Math.min(startPos.value.x, currentPos.value.x)
  const top = Math.min(startPos.value.y, currentPos.value.y)
  const width = Math.abs(currentPos.value.x - startPos.value.x)
  const height = Math.abs(currentPos.value.y - startPos.value.y)

  return {
    left: `${left}px`,
    top: `${top}px`,
    width: `${width}px`,
    height: `${height}px`,
  }
})
</script>

<style scoped>
/* 使用 scoped CSS 以免污染页面，Plasmo 会自动注入到 Shadow DOM */
.crop-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 2147483647; /* 浏览器允许的最大 z-index */
  cursor: crosshair;
  user-select: none;
}

.tip-box {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  pointer-events: none;
}

.selection-box {
  position: absolute;
  border: 2px solid #3b82f6; /* Tailwind blue-500 */
  /* 这一行是用 CSS 实现“选区外变暗”的关键 trick */
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
  pointer-events: none;
}
</style>
