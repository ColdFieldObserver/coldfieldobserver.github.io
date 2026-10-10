<script setup lang="ts">
import { ref } from 'vue';
import ToolResult from './ToolResult.vue';

// URL 编解码（对齐 StarLight-7693.github.io.react 的 UrlTool）
const input = ref('');
const result = ref('');
const status = ref<'idle' | 'success' | 'error'>('idle');

function run(mode: 'encodeURI' | 'decodeURI' | 'encodeComponent' | 'decodeComponent'): void {
  if (!input.value.trim()) {
    result.value = '请输入文本';
    status.value = 'error';
    return;
  }
  try {
    switch (mode) {
      case 'encodeURI':
        result.value = encodeURI(input.value);
        break;
      case 'decodeURI':
        result.value = decodeURI(input.value);
        break;
      case 'encodeComponent':
        result.value = encodeURIComponent(input.value);
        break;
      case 'decodeComponent':
        result.value = decodeURIComponent(input.value);
        break;
    }
    status.value = 'success';
  } catch {
    result.value =
      mode === 'encodeURI' || mode === 'encodeComponent'
        ? '编码失败：输入包含无法编码的字符'
        : '解码失败：请输入有效的 URL 编码（如 %E4%BD%A0%E5%A5%BD）';
    status.value = 'error';
  }
}

function clear(): void {
  input.value = '';
  result.value = '';
  status.value = 'idle';
}
</script>

<template>
  <div class="tool-view">
    <div class="field">
      <label class="field-label" for="url-input">输入文本</label>
      <textarea
        id="url-input"
        v-model="input"
        class="mecha-textarea"
        placeholder="请输入要编码或解码的 URL / 文本…"
        spellcheck="false"
      />
    </div>

    <div class="btn-row">
      <button type="button" class="mecha-btn primary" @click="run('encodeURI')">encodeURI</button>
      <button type="button" class="mecha-btn" @click="run('decodeURI')">decodeURI</button>
      <button type="button" class="mecha-btn" @click="run('encodeComponent')">encodeURIComponent</button>
      <button type="button" class="mecha-btn" @click="run('decodeComponent')">decodeURIComponent</button>
      <button type="button" class="mecha-btn" @click="clear">清空</button>
    </div>

    <ToolResult :result="result" :status="status" />

    <div class="info-block">
      <h2>两者的区别</h2>
      <ul>
        <li><code>encodeURI</code> 用于编码完整 URL，会保留 <code>:/?#[]@!$&amp;'()*+,;=</code> 等分隔符</li>
        <li><code>encodeURIComponent</code> 用于编码 URL 参数值，会把几乎所有非字母数字字符转为转义序列</li>
        <li>编码单个查询参数时请使用 <code>encodeURIComponent</code>，否则其中的 <code>&amp;</code> 会破坏参数结构</li>
      </ul>
    </div>
  </div>
</template>
