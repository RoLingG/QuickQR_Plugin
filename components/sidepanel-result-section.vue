<template>
  <div class="result-section">
    <!-- 安全警告区域 -->
    <div v-if="urlSecurityWarnings.length > 0" class="security-warning" :class="`risk-${urlRiskLevel}`">
      <div class="warning-header">
        <span class="warning-icon">🛡️</span>
        <span class="warning-title">Security Alert</span>
      </div>
      <ul class="warning-list">
        <li v-for="(warning, index) in urlSecurityWarnings" :key="index">{{ warning }}</li>
      </ul>
      <p class="warning-footer">Please verify the URL before visiting</p>
    </div>

    <div class="result-header">
      <h3>Result.</h3>
      <div class="result-actions">
        <button v-if="showOpenUrl" @click="$emit('open-url')" class="copy-link">OPEN URL</button>
        <button @click="$emit('copy-text')" class="copy-link">{{ copyText }}</button>
      </div>
    </div>
    <div class="result-card">
      <textarea readonly class="result-content">{{ qrResult }}</textarea>
      <div class="result-footer">
        <span>TYPE: {{ type }}</span>
        <span>{{ new Date().toLocaleTimeString() }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  qrResult: string
  type: 'SCAN' | 'FILE'
  urlSecurityWarnings: string[]
  urlRiskLevel: 'low' | 'medium' | 'high'
  copyText: string
  showOpenUrl: boolean
}>()

defineEmits<{
  'open-url': []
  'copy-text': []
}>()
</script>

<style scoped>
/* === 安全警告样式 === */
.security-warning {
  background: white;
  border: 3px solid var(--border-color);
  padding: 12px 16px;
  margin-bottom: 16px;
  border-left: 6px solid;
}

.security-warning.risk-low {
  border-left-color: #10b981;
  background: #f0fdf4;
}

.security-warning.risk-medium {
  border-left-color: #f59e0b;
  background: #fffbeb;
}

.security-warning.risk-high {
  border-left-color: #ef4444;
  background: #fef2f2;
}

.warning-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.warning-icon {
  font-size: 18px;
}

.warning-title {
  font-size: 13px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.warning-list {
  margin: 8px 0;
  padding-left: 20px;
  font-size: 11px;
  font-weight: 600;
  line-height: 1.6;
}

.warning-list li {
  margin: 4px 0;
}

.warning-footer {
  margin: 8px 0 0 0;
  font-size: 10px;
  font-weight: 700;
  color: var(--text-secondary);
  font-style: italic;
}

/* === 结果通用样式 === */
.result-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 8px;
}

.result-header h3 {
  font-size: 16px;
  font-weight: 800;
  margin: 0;
}

.result-actions {
  display: flex;
  gap: 8px;
}

.copy-link {
  background: none;
  border: none;
  font-family: inherit;
  font-size: 10px;
  font-weight: 800;
  color: var(--accent-color);
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 4px;
  transition: opacity 0.2s;
}

.copy-link:hover {
  opacity: 0.7;
}

.result-card {
  background: white;
  border: 2px solid var(--border-color);
  padding: 16px;
  border-left: 6px solid var(--rh-accent);
  box-shadow: 4px 4px 0 rgba(0,0,0,0.1);
}

.result-content {
  width: 100%;
  border: none;
  resize: none;
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-primary);
  outline: none;
  height: auto;
  min-height: 60px;
}

.result-footer {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 2px dashed #ccc;
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: var(--text-secondary);
}
</style>
