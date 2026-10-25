<script setup lang="ts">
import { openSearchDialog } from '~/composables/useSearch';
</script>

<template>
  <button
    class="search-launcher mecha-clip-s mb-[18px] flex w-full items-center gap-3 border border-line bg-panel px-4 py-3 text-left text-[14px] text-ink-3 transition-colors hover:border-accent hover:text-ink-2"
    type="button"
    aria-haspopup="dialog"
    @click="openSearchDialog($event.currentTarget as HTMLElement)"
  >
    <Icon name="i-lucide-search" class="size-4 shrink-0" aria-hidden="true" />
    <span class="flex-1">检索日志标题、正文与标签…</span>
    <kbd class="mecha-clip-s border border-line px-1.5 py-0.5 font-mono text-[10.5px] text-ink-3">
      Ctrl K
    </kbd>
  </button>

  <!-- 无 JS 时上面的弹窗打不开，退化成站内搜索页链接 -->
  <NuxtLink class="search-launcher-fallback hidden text-accent-2 underline" to="/search/">
    打开搜索页
  </NuxtLink>
</template>
