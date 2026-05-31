<template>
  <div class="content-card mica-card">
    <h2>Unicode编解码工具</h2>
    <p>这是一个简单的Unicode编码和解码工具，支持文本与Unicode码点之间的相互转换。</p>

    <div class="form-group">
      <label class="form-label" for="inputText">输入文本：</label>
      <textarea
        class="textarea"
        id="inputText"
        v-model="input"
        placeholder="请输入要编码或解码的文本..."
        @keydown="handleKeydown"
      ></textarea>
    </div>

    <div class="btn-group">
      <button class="btn btn-block" @click="encode">编码为Unicode</button>
      <button class="btn btn-block" @click="decode">解码Unicode</button>
      <button class="btn btn-block" @click="clear">清空</button>
    </div>

    <ToolResultBox
      label="结果："
      :result="result"
      :result-type="resultType"
      placeholder="结果将显示在这里..."
    />

    <SidebarBlock title="关于Unicode">
      <ul>
        <li>Unicode是一种字符编码标准，旨在统一世界上所有文字的编码</li>
        <li>支持超过14万个字符，涵盖世界上绝大多数文字系统</li>
        <li>Unicode码点通常表示为U+XXXX格式，其中XXXX是十六进制数</li>
        <li>本工具支持UTF-16编码格式的Unicode转换</li>
      </ul>
    </SidebarBlock>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useUnicode } from '../../composables/useUnicode'
import ToolResultBox from '../../components/ToolResultBox.vue'
import SidebarBlock from '../../components/SidebarBlock.vue'

const { input, result, resultType, encode, decode, clear } = useUnicode()

function handleKeydown(event) {
  if (event.ctrlKey || event.metaKey) {
    switch (event.key) {
      case 'Enter':
        event.preventDefault()
        encode()
        break
      case 'd':
        event.preventDefault()
        decode()
        break
    }
  }
}

function globalKeydown(event) {
  if ((event.ctrlKey || event.metaKey) && event.key === 'c' && document.activeElement?.id !== 'inputText') {
    event.preventDefault()
    const copyBtn = document.querySelector('.tool-result-box + .btn')
    if (copyBtn) copyBtn.click()
  }
}

onMounted(() => {
  document.addEventListener('keydown', globalKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', globalKeydown)
})
</script>

<style scoped>
</style>