<script setup lang="ts">
import { ref } from 'vue';
import { writeClipboard } from '@/utils/clipboard';

/**
 * 工具页面外壳：统一的状态面板（成功 / 错误）+ 结果框 + 一键复制。
 * 各工具通过 v-model:result 写入结果，并传入 status 控制配色。
 */
const props = withDefaults(
  defineProps<{
    result: string;
    status?: 'idle' | 'success' | 'error';
    placeholder?: string;
  }>(),
  { status: 'idle', placeholder: '结果将显示在这里…' },
);

const copied = ref(false);
let timer: number | undefined;

async function copy(): Promise<void> {
  if (!props.result || props.status === 'error') return;
  const ok = await writeClipboard(props.result);
  if (!ok) return;
  copied.value = true;
  if (timer !== undefined) window.clearTimeout(timer);
  timer = window.setTimeout(() => {
    copied.value = false;
  }, 1800);
}
</script>

<template>
  <div class="tool-result">
    <div class="result-head">
      <label class="result-label">输出结果</label>
      <span class="result-status" :data-status="status">
        <i aria-hidden="true" />
        {{ status === 'error' ? 'ERROR' : status === 'success' ? 'OK' : 'IDLE' }}
      </span>
    </div>

    <div class="result-box" :data-status="status">{{ result || placeholder }}</div>

    <div class="result-actions">
      <button type="button" class="mecha-btn copy-btn" @click="copy">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="9" y="9" width="12" height="12" rx="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
        {{ copied ? '已复制' : '复制结果' }}
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '../../styles/variables' as *;
@use '../../styles/mixins' as *;

.tool-result {
  margin-top: 18px;
}

.result-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 7px;
}

.result-label {
  font-family: $font-mono;
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 1.6px;
  text-transform: uppercase;
  color: $ink-3;
}

.result-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: $font-mono;
  font-size: 11px;
  letter-spacing: 1.2px;
  color: $ink-3;

  i {
    width: 8px;
    height: 8px;
    background: var(--line);
    clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  }

  &[data-status='success'] i {
    background: #2ea86b;
  }

  &[data-status='error'] i {
    background: #d94a45;
  }
}

.result-box {
  min-height: 96px;
  max-height: 340px;
  padding: 13px 15px;
  overflow: auto;
  font-family: $font-mono;
  font-size: 13.5px;
  line-height: 1.75;
  white-space: pre-wrap;
  word-break: break-all;
  color: var(--ink);
  background: var(--code-bg);
  border: 1px solid $line;
  border-left: 2px solid $edge;
  @include thin-scrollbar;

  &[data-status='success'] {
    border-left-color: #2ea86b;
  }

  &[data-status='error'] {
    color: #d94a45;
    border-left-color: #d94a45;
  }
}

.result-actions {
  margin-top: 12px;
}

.copy-btn {
  svg {
    width: 15px;
    height: 15px;
  }
}
</style>
