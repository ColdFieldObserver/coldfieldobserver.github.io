<script setup lang="ts">
import { ref } from 'vue';
import ToolResult from './ToolResult.vue';

// 时间戳转换（沿用原项目 tools/timestamp/script.js 的逻辑）
const timestampInput = ref('');
const datetimeInput = ref('');
const result = ref('');
const status = ref<'idle' | 'success' | 'error'>('idle');

/** 本地日期时间 → datetime-local 需要的 YYYY-MM-DDTHH:mm */
function toLocalInputValue(date: Date): string {
  const pad = (value: number): string => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function formatLocal(date: Date): string {
  return date.toLocaleString('zh-CN', { hour12: false });
}

/** 时间戳 → 日期时间 */
function fromTimestamp(): void {
  const raw = timestampInput.value.trim();
  if (!raw) {
    result.value = '请输入时间戳';
    status.value = 'error';
    return;
  }
  if (!/^\d+$/.test(raw)) {
    result.value = '转换失败：时间戳必须为数字';
    status.value = 'error';
    return;
  }

  let ms = Number(raw);
  const seconds = raw.length <= 10;
  if (seconds) ms *= 1000;

  const date = new Date(ms);
  if (Number.isNaN(date.getTime())) {
    result.value = '转换失败：无效的时间戳';
    status.value = 'error';
    return;
  }

  datetimeInput.value = toLocalInputValue(date);
  result.value = [
    `本地时间：${formatLocal(date)}`,
    `UTC 时间：${date.toUTCString()}`,
    `ISO 8601：${date.toISOString()}`,
    `时间戳类型：${seconds ? '秒级' : '毫秒级'}`,
  ].join('\n');
  status.value = 'success';
}

/** 日期时间 → 时间戳 */
function toTimestamp(): void {
  const raw = datetimeInput.value;
  if (!raw) {
    result.value = '请选择日期时间';
    status.value = 'error';
    return;
  }
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) {
    result.value = '转换失败：无效的日期时间';
    status.value = 'error';
    return;
  }

  const sec = Math.floor(date.getTime() / 1000);
  const ms = date.getTime();
  timestampInput.value = String(sec);
  result.value = [`秒级时间戳：${sec}`, `毫秒级时间戳：${ms}`, `本地时间：${formatLocal(date)}`].join(
    '\n',
  );
  status.value = 'success';
}

/** 取当前时间 */
function now(): void {
  const date = new Date();
  timestampInput.value = String(Math.floor(date.getTime() / 1000));
  datetimeInput.value = toLocalInputValue(date);
  result.value = [
    `当前时间戳（毫秒）：${date.getTime()}`,
    `当前时间戳（秒）：${Math.floor(date.getTime() / 1000)}`,
    `当前本地时间：${formatLocal(date)}`,
  ].join('\n');
  status.value = 'success';
}

function clear(): void {
  timestampInput.value = '';
  datetimeInput.value = '';
  result.value = '';
  status.value = 'idle';
}
</script>

<template>
  <div class="tool-view">
    <div class="field">
      <label class="field-label" for="ts-input">时间戳（秒 / 毫秒）</label>
      <input id="ts-input" v-model="timestampInput" class="mecha-input" placeholder="例如 1760000000" inputmode="numeric" />
    </div>

    <div class="field">
      <label class="field-label" for="dt-input">日期时间</label>
      <input id="dt-input" v-model="datetimeInput" class="mecha-input" type="datetime-local" step="1" />
    </div>

    <div class="btn-row">
      <button type="button" class="mecha-btn primary" @click="fromTimestamp">时间戳 → 日期</button>
      <button type="button" class="mecha-btn" @click="toTimestamp">日期 → 时间戳</button>
      <button type="button" class="mecha-btn" @click="now">取当前时间</button>
      <button type="button" class="mecha-btn" @click="clear">清空</button>
    </div>

    <ToolResult :result="result" :status="status" />

    <div class="info-block">
      <h2>使用说明</h2>
      <ul>
        <li>10 位数字按秒级时间戳处理，13 位数字按毫秒级处理</li>
        <li>「取当前时间」会同时填充时间戳与日期时间两个输入框</li>
        <li>本地时间依据浏览器所在时区显示，UTC 与 ISO 8601 便于跨时区对照</li>
      </ul>
    </div>
  </div>
</template>
