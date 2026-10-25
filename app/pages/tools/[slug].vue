<script setup lang="ts">
import { computed, ref } from 'vue';
import { TOOL_LINKS } from '#shared/site';

// 5 个纯前端小工具：输入 → 实时结果，一键复制
const route = useRoute();
const slug = computed(() => String(route.params.slug ?? ''));
const tool = computed(() => TOOL_LINKS.find((item) => item.slug === slug.value));

if (!tool.value) {
  throw createError({ statusCode: 404, statusMessage: '工具不存在', fatal: true });
}

const input = ref('');
const mode = ref<'encode' | 'decode'>('encode');
const copied = ref(false);

const output = computed(() => {
  const text = input.value;
  if (!text.trim()) return '';
  try {
    switch (slug.value) {
      case 'base64':
        return mode.value === 'encode'
          ? btoa(String.fromCharCode(...new TextEncoder().encode(text)))
          : new TextDecoder().decode(Uint8Array.from(atob(text.trim()), (c) => c.charCodeAt(0)));
      case 'unicode':
        return mode.value === 'encode'
          ? [...text].map((ch) => `\\u${ch.codePointAt(0)!.toString(16).padStart(4, '0')}`).join('')
          : text.replace(/\\u\{?([0-9a-fA-F]{1,6})\}?/g, (_, hex: string) =>
              String.fromCodePoint(Number.parseInt(hex, 16)),
            );
      case 'url':
        return mode.value === 'encode' ? encodeURIComponent(text) : decodeURIComponent(text);
      case 'timestamp': {
        const raw = text.trim();
        const num = Number(raw);
        if (Number.isFinite(num) && raw !== '') {
          const ms = raw.length >= 13 ? num : num * 1000;
          const date = new Date(ms);
          if (Number.isNaN(date.getTime())) return '无法解析该时间戳';
          return `本地：${date.toLocaleString('zh-CN', { hour12: false })}\nUTC ：${date.toISOString()}`;
        }
        const date = new Date(raw);
        if (Number.isNaN(date.getTime())) return '无法解析该时间';
        return `秒  ：${Math.floor(date.getTime() / 1000)}\n毫秒：${date.getTime()}`;
      }
      case 'eggyparty-map-text': {
        const id = text.match(/\d{6,}/)?.[0] ?? '';
        const name = text.match(/地图[:：]\s*(\S+)/)?.[1] ?? text.split('\n')[0]?.slice(0, 24) ?? '';
        return `地图：${name}\n地图 ID：${id || '（未识别）'}\n\n复制 ID 在游戏内「地图工坊 - 搜索」中粘贴即可进入。`;
      }
      default:
        return '';
    }
  } catch {
    return '解析失败：请检查输入内容';
  }
});

const MODES: Record<string, [string, string] | null> = {
  base64: ['编码', '解码'],
  unicode: ['文本 → 码点', '码点 → 文本'],
  url: ['编码', '解码'],
  timestamp: null,
  'eggyparty-map-text': null,
};

async function copy(): Promise<void> {
  if (!output.value) return;
  try {
    await navigator.clipboard.writeText(output.value);
    copied.value = true;
    window.setTimeout(() => (copied.value = false), 1500);
  } catch {
    copied.value = false;
  }
}

useHead({ title: computed(() => tool.value?.name ?? '工具') });
</script>

<template>
  <div class="mx-auto max-w-page">
    <header class="mb-6 border-b border-line pb-4">
      <h1 class="mecha-title">{{ tool?.name }}</h1>
      <p class="mt-2 text-[13px] text-ink-3">{{ tool?.desc }}</p>
    </header>

    <div class="mecha-clip-s border border-line bg-card p-5">
      <div v-if="MODES[slug]" class="mb-4 flex gap-2">
        <button
          v-for="(label, index) in MODES[slug]"
          :key="label"
          class="mecha-clip-s border px-3.5 py-1.5 font-mono text-[12.5px] transition-colors"
          :class="
            (index === 0 ? 'encode' : 'decode') === mode
              ? 'border-accent bg-accent text-on-accent'
              : 'border-line bg-panel text-ink-2 hover:border-edge hover:bg-accent-soft'
          "
          type="button"
          @click="mode = index === 0 ? 'encode' : 'decode'"
        >
          {{ label }}
        </button>
      </div>

      <label class="mb-2 block font-mono text-[11.5px] tracking-[1px] text-ink-3">
        {{ slug === 'timestamp' ? '时间戳或日期时间（如 2026-10-25 10:00:00）' : '输入' }}
      </label>
      <textarea
        v-model="input"
        rows="6"
        class="w-full resize-y border border-line bg-bg p-3 font-mono text-[13px] text-ink outline-none focus:border-accent"
        placeholder="在此输入…"
      />

      <div class="mt-4 mb-2 flex items-center justify-between">
        <span class="font-mono text-[11.5px] tracking-[1px] text-ink-3">结果</span>
        <button
          class="font-mono text-[11.5px] text-accent-2 transition-colors hover:text-accent disabled:opacity-40"
          type="button"
          :disabled="!output"
          @click="copy"
        >
          {{ copied ? '已复制 ✓' : '复制结果' }}
        </button>
      </div>
      <pre
        class="min-h-[92px] overflow-x-auto border border-line bg-bg p-3 font-mono text-[13px] whitespace-pre-wrap text-ink-2"
      >{{ output || '（结果会实时显示在这里）' }}</pre>
    </div>
  </div>
</template>
