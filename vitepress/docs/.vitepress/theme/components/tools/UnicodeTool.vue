<script setup lang="ts">
import { ref } from 'vue';
import ToolResult from './ToolResult.vue';

// Unicode 编解码（沿用原项目 tools/unicode/script.js 的算法）
const input = ref('');
const result = ref('');
const status = ref<'idle' | 'success' | 'error'>('idle');

/** 支持 \\uXXXX 与 \\u{XXXXX}（码点）两种写法 */
function encode(): void {
  const text = input.value;
  if (!text.trim()) {
    result.value = '请输入要编码的文本';
    status.value = 'error';
    return;
  }
  let out = '';
  for (const char of text) {
    const codePoint = char.codePointAt(0) ?? 0;
    if (codePoint <= 0xffff) {
      out += '\\u' + codePoint.toString(16).toUpperCase().padStart(4, '0');
    } else {
      out += '\\u{' + codePoint.toString(16).toUpperCase() + '}';
    }
  }
  result.value = out;
  status.value = 'success';
}

function decode(): void {
  const text = input.value;
  if (!text.trim()) {
    result.value = '请输入要解码的 Unicode 文本';
    status.value = 'error';
    return;
  }
  try {
    // 先处理 \u{XXXXX} 码点写法，再处理连续的 \uXXXX 代理对
    let out = text.replace(/\\u\{([0-9a-fA-F]{1,6})\}/g, (_match, hex: string) =>
      String.fromCodePoint(parseInt(hex, 16)),
    );
    out = out.replace(/(?:\\u[0-9a-fA-F]{4})+/g, (seq) => {
      const units: number[] = [];
      const regex = /\\u([0-9a-fA-F]{4})/g;
      let match: RegExpExecArray | null;
      while ((match = regex.exec(seq)) !== null) units.push(parseInt(match[1], 16));
      // 还原 UTF-16 代理对
      let text2 = '';
      for (let i = 0; i < units.length; i += 1) {
        const unit = units[i];
        if (unit >= 0xd800 && unit <= 0xdbff && i + 1 < units.length) {
          const next = units[i + 1];
          if (next >= 0xdc00 && next <= 0xdfff) {
            text2 += String.fromCodePoint((unit - 0xd800) * 0x400 + next - 0xdc00 + 0x10000);
            i += 1;
            continue;
          }
        }
        text2 += String.fromCharCode(unit);
      }
      return text2;
    });

    if (/\\u\{?[0-9a-fA-F]{1,6}\}?/.test(out)) throw new Error('存在未识别的转义序列');
    result.value = out;
    status.value = 'success';
  } catch {
    result.value = '解码失败：请输入有效的 Unicode 编码格式（如 \\u4F60\\u597D）';
    status.value = 'error';
  }
}

function clear(): void {
  input.value = '';
  result.value = '';
  status.value = 'idle';
}

function onKeydown(event: KeyboardEvent): void {
  if (!event.ctrlKey && !event.metaKey) return;
  if (event.key === 'Enter') {
    event.preventDefault();
    encode();
  } else if (event.key.toLowerCase() === 'd') {
    event.preventDefault();
    decode();
  }
}
</script>

<template>
  <div class="tool-view">
    <div class="field">
      <label class="field-label" for="uni-input">输入文本</label>
      <textarea
        id="uni-input"
        v-model="input"
        class="mecha-textarea"
        placeholder="请输入要编码或解码的文本…"
        spellcheck="false"
        @keydown="onKeydown"
      />
      <p class="hint-line">快捷键：Ctrl / ⌘ + Enter 编码，Ctrl / ⌘ + D 解码</p>
    </div>

    <div class="btn-row">
      <button type="button" class="mecha-btn primary" @click="encode">编码为 Unicode</button>
      <button type="button" class="mecha-btn" @click="decode">解码 Unicode</button>
      <button type="button" class="mecha-btn" @click="clear">清空</button>
    </div>

    <ToolResult :result="result" :status="status" />

    <div class="info-block">
      <h2>关于 Unicode</h2>
      <ul>
        <li>Unicode 是一种字符编码标准，旨在统一世界上所有文字的编码</li>
        <li>支持超过 14 万个字符，涵盖世界上绝大多数文字系统</li>
        <li>Unicode 码点通常表示为 U+XXXX 格式，其中 XXXX 是十六进制数</li>
        <li>本工具支持 UTF-16 代理对与 <code>\u{XXXXX}</code> 码点写法</li>
      </ul>
    </div>
  </div>
</template>
