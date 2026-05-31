<template>
  <div class="content-card mica-card">
    <h2>时间戳转换工具</h2>
    <p>这是一个简单的时间戳转换工具，支持时间戳与日期时间之间的相互转换。</p>

    <div class="form-group">
      <label class="form-label" for="timestampInput">时间戳：</label>
      <input
        type="text"
        class="input"
        id="timestampInput"
        v-model="timestampInput"
        placeholder="请输入时间戳（秒或毫秒）"
        @keydown="handleKeydown"
        @input="onTimestampInput"
      />
    </div>

    <div class="form-group">
      <label class="form-label" for="datetimeInput">日期时间：</label>
      <input
        type="datetime-local"
        class="input"
        id="datetimeInput"
        v-model="datetimeInput"
        @keydown="handleKeydown"
        @change="onDatetimeChange"
      />
    </div>

    <div class="btn-group">
      <button class="btn btn-block" @click="timestampToDatetime">时间戳 → 日期时间</button>
      <button class="btn btn-block" @click="datetimeToTimestamp">日期时间 → 时间戳</button>
      <button class="btn btn-block" @click="getCurrentTimestamp">获取当前时间戳</button>
      <button class="btn btn-block" @click="clear">清空</button>
    </div>

    <ToolResultBox
      label="转换结果："
      :result="result"
      :result-type="resultType"
      placeholder="结果将显示在这里..."
    />

    <SidebarBlock title="关于时间戳">
      <ul>
        <li>时间戳是从1970年1月1日00:00:00 UTC开始计算的秒数或毫秒数</li>
        <li>Unix时间戳通常以秒为单位（10位数字）</li>
        <li>JavaScript时间戳以毫秒为单位（13位数字）</li>
        <li>本工具自动识别秒级和毫秒级时间戳</li>
        <li>支持本地时间和UTC时间的转换</li>
      </ul>
    </SidebarBlock>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useTimestamp } from '../../composables/useTimestamp'
import ToolResultBox from '../../components/ToolResultBox.vue'
import SidebarBlock from '../../components/SidebarBlock.vue'

const { timestampInput, datetimeInput, result, resultType, timestampToDatetime, datetimeToTimestamp, getCurrentTimestamp, clear } = useTimestamp()

function onTimestampInput() {
  if (timestampInput.value.trim()) {
    timestampToDatetime()
  }
}

function onDatetimeChange() {
  if (datetimeInput.value) {
    datetimeToTimestamp()
  }
}

function handleKeydown(event) {
  if (event.ctrlKey || event.metaKey) {
    switch (event.key) {
      case 'Enter':
        event.preventDefault()
        timestampToDatetime()
        break
      case 'd':
        event.preventDefault()
        datetimeToTimestamp()
        break
      case 'n':
        event.preventDefault()
        getCurrentTimestamp()
        break
    }
  }
}

function globalKeydown(event) {
  if ((event.ctrlKey || event.metaKey) && event.key === 'c' &&
      document.activeElement?.id !== 'timestampInput' &&
      document.activeElement?.id !== 'datetimeInput') {
    event.preventDefault()
    const copyBtn = document.querySelector('.tool-result-box + .btn')
    if (copyBtn) copyBtn.click()
  }
}

onMounted(() => {
  getCurrentTimestamp()
  document.addEventListener('keydown', globalKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', globalKeydown)
})
</script>

<style scoped>
</style>