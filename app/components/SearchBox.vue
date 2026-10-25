<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { searchKeyword, syncKeywordFromUrl, writeKeywordToUrl } from '~/composables/useSearch';

/**
 * 全站共享的搜索框。
 * - 搜索弹窗与 /search/ 直达页共用关键词并即时过滤
 * - 输入只用 replaceState 同步地址栏，不触发路由重建
 * - 禁用 JS 时显示降级提示（html:not(.js) 控制显隐）
 */
const props = withDefaults(defineProps<{ autofocus?: boolean }>(), { autofocus: false });

const inputEl = ref<HTMLInputElement | null>(null);
const value = searchKeyword;
const mounted = ref(false);

function onInput(event: Event): void {
  value.value = (event.target as HTMLInputElement).value;
  writeKeywordToUrl();
}

function onSubmit(): void {
  writeKeywordToUrl();
}

onMounted(() => {
  mounted.value = true;
  syncKeywordFromUrl();
  if (props.autofocus) inputEl.value?.focus({ preventScroll: true });
});
</script>

<template>
  <form class="mb-4" role="search" @submit.prevent="onSubmit">
    <!-- 降级提示：普通元素而非 <noscript>，避免 hydration 不一致 -->
    <p class="news-search-noscript hidden text-[13px] text-ink-3">
      本站搜索需要启用 JavaScript。你可以使用
      <NuxtLink class="text-accent-2 underline" to="/atom.xml">RSS 订阅</NuxtLink>
      获取最新日志。
    </p>

    <template v-if="mounted">
      <div
        class="mecha-clip-s flex items-center gap-2.5 border border-line bg-panel px-3.5 py-2.5 transition-colors focus-within:border-accent"
      >
        <Icon name="i-lucide-search" class="size-4 shrink-0 text-ink-3" aria-hidden="true" />
        <input
          ref="inputEl"
          class="min-w-0 flex-1 bg-transparent font-mono text-[14px] text-ink outline-none placeholder:text-ink-3"
          type="search"
          name="q"
          autocomplete="off"
          placeholder="检索日志标题、正文与标签…"
          :value="value"
          @input="onInput"
        />
        <button
          v-if="value"
          type="button"
          class="text-ink-3 transition-colors hover:text-accent-2"
          aria-label="清空关键词"
          @click="
            () => {
              value = '';
              writeKeywordToUrl();
              inputEl?.focus();
            }
          "
        >
          <Icon name="i-lucide-x" class="size-4" />
        </button>
      </div>
    </template>
  </form>
</template>
