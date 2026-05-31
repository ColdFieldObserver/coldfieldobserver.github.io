<template>
  <div class="content-card mica-card">
    <h2>Base64编码/解码工具</h2>
    <p>这是一个简单的Base64编码和解码工具，支持文本的相互转换。</p>

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
      <button class="btn btn-block" @click="encode">编码为Base64</button>
      <button class="btn btn-block" @click="decode">解码Base64</button>
      <button class="btn btn-block" @click="clear">清空</button>
    </div>

    <ToolResultBox
      label="结果："
      :result="result"
      :result-type="resultType"
      placeholder="结果将显示在这里..."
    />

    <SidebarBlock title="关于Base64">
      <ul>
        <li>Base64是一种基于64个可打印字符来表示二进制数据的编码方式</li>
        <li>常用于在文本环境中传输或存储二进制数据</li>
        <li>编码后的数据比原始数据大约增加33%</li>
        <li>广泛应用于电子邮件、数据URL、图片编码等场景</li>
      </ul>
    </SidebarBlock>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useBase64 } from '../../composables/useBase64'
import ToolResultBox from '../../components/ToolResultBox.vue'
import SidebarBlock from '../../components/SidebarBlock.vue'

const { input, result, resultType, encode, decode, clear } = useBase64()

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