<template>
  <div class="content-card mica-card">
    <h2>URL编解码工具</h2>
    <p>这是一个简单的URL编码和解码工具，支持URL字符串的编码和解码操作。</p>

    <div class="form-group">
      <label class="form-label" for="inputText">输入文本：</label>
      <textarea
        class="textarea"
        id="inputText"
        v-model="input"
        :placeholder="placeholderText"
        @keydown="handleKeydown"
      ></textarea>
      <button class="btn btn-secondary btn-sm" style="margin-top: 0.5rem" @click="loadExample">加载示例</button>
    </div>

    <div class="btn-group">
      <button class="btn btn-block" @click="encodeURL">编码URL</button>
      <button class="btn btn-block" @click="decodeURL">解码URL</button>
      <button class="btn btn-block" @click="encodeComponent">编码URL组件</button>
      <button class="btn btn-block" @click="decodeComponent">解码URL组件</button>
      <button class="btn btn-block" @click="clear">清空</button>
    </div>

    <ToolResultBox
      label="结果："
      :result="result"
      :result-type="resultType"
      placeholder="结果将显示在这里..."
    />

    <SidebarBlock title="关于URL编码">
      <ul>
        <li>URL编码用于将特殊字符转换为%后跟两位十六进制数的格式</li>
        <li>encodeURI() 用于编码整个URL，保留合法字符</li>
        <li>encodeURIComponent() 用于编码URL组件，编码更多字符</li>
        <li>空格会被编码为%20，中文字符会被编码为UTF-8格式</li>
        <li>本工具支持完整的URL编码和解码功能</li>
      </ul>
    </SidebarBlock>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useUrl } from '../../composables/useUrl'
import ToolResultBox from '../../components/ToolResultBox.vue'
import SidebarBlock from '../../components/SidebarBlock.vue'

const { input, result, resultType, encodeURL, decodeURL, encodeComponent, decodeComponent, clear } = useUrl()

const exampleText = '示例：https://example.com/测试页面?参数=值&name=张三'
const placeholderText = ref('请输入要编码或解码的URL文本...')

function loadExample() {
  input.value = exampleText
}

function handleKeydown(event) {
  if (event.ctrlKey || event.metaKey) {
    switch (event.key) {
      case 'Enter':
        event.preventDefault()
        encodeURL()
        break
      case 'd':
        event.preventDefault()
        decodeURL()
        break
      case 'e':
        event.preventDefault()
        encodeComponent()
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
  placeholderText.value = exampleText
  document.addEventListener('keydown', globalKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', globalKeydown)
})
</script>

<style scoped>
</style>