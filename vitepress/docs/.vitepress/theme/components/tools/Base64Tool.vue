<script setup lang="ts">
import { ref } from 'vue';
import ToolResult from './ToolResult.vue';

// Base64 编解码（沿用原项目 tools/base64/script.js 的算法，改为 Vue 组件）
const input = ref('');
const result = ref('');
const status = ref<'idle' | 'success' | 'error'>('idle');

function run(mode: 'encode' | 'decode'): void {
  const text = input.value;
  if (!text.trim()) {
    result.value = mode === 'encode' ? '请输入要编码的文本' : '请输入要解码的 Base64 文本';
    status.value = 'error';
    return;
  }
  try {
    // TextEncoder / TextDecoder 安全处理 UTF-8 中文（替代废弃的 unescape/escape）
    if (mode === 'encode') {
      const bytes = new TextEncoder().encode(text);
      let binary = '';
      for (const byte of bytes) binary += String.fromCharCode(byte);
      result.value = btoa(binary);
    } else {
      const binary = atob(text.replace(/\s+/g, ''));
      const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
      result.value = new TextDecoder().decode(bytes);
    }
    status.value = 'success';
  } catch {
    result.value = mode === 'encode' ? '编码失败：输入包含无效字符' : '解码失败：请输入有效的 Base64 编码';
    status.value = 'error';
  }
}

function clear(): void {
  input.value = '';
  result.value = '';
  status.value = 'idle';
}

/** Ctrl/Cmd + Enter 编码，Ctrl/Cmd + D 解码 */
function onKeydown(event: KeyboardEvent): void {
  if (!event.ctrlKey && !event.metaKey) return;
  if (event.key === 'Enter') {
    event.preventDefault();
    run('encode');
  } else if (event.key.toLowerCase() === 'd') {
    event.preventDefault();
    run('decode');
  }
}
</script>

<template>
  <div class="tool-view">
    <div class="field">
      <label class="field-label" for="b64-input">输入文本</label>
      <textarea
        id="b64-input"
        v-model="input"
        class="mecha-textarea"
        placeholder="请输入要编码或解码的文本…"
        spellcheck="false"
        @keydown="onKeydown"
      />
      <p class="hint-line">快捷键：Ctrl / ⌘ + Enter 编码，Ctrl / ⌘ + D 解码</p>
    </div>

    <div class="btn-row">
      <button type="button" class="mecha-btn primary" @click="run('encode')">编码为 Base64</button>
      <button type="button" class="mecha-btn" @click="run('decode')">解码 Base64</button>
      <button type="button" class="mecha-btn" @click="clear">清空</button>
    </div>

    <ToolResult :result="result" :status="status" />

    <div class="info-block">
      <h2>关于 Base64</h2>
      <ul>
        <li>Base64 是一种基于 64 个可打印字符来表示二进制数据的编码方式</li>
        <li>常用于在文本环境中传输或存储二进制数据</li>
        <li>编码后的数据比原始数据大约增加 33%</li>
        <li>广泛应用于电子邮件、Data URL、图片编码等场景</li>
      </ul>
    </div>
  </div>
</template>
