<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { withBase } from 'vitepress';
import { searchKeyword, syncKeywordFromUrl, writeKeywordToUrl } from '@/composables/useSearch';

/**
 * 全站共享的搜索框。
 * - 搜索对话框与 /search/ 直达页共用关键词并即时过滤
 * - 输入只用 replaceState 同步地址栏，不触发路由重建
 * - 禁用 JavaScript 时显示降级提示（由 CSS 依据 <html> 上的 .js 标记控制显隐）
 */
const props = withDefaults(defineProps<{ autofocus?: boolean }>(), { autofocus: false });

const inputEl = ref<HTMLInputElement | null>(null);
const value = searchKeyword;
const mounted = ref(false);

function onInput(event: Event) {
  value.value = (event.target as HTMLInputElement).value;
  writeKeywordToUrl();
}

function onSubmit() {
  writeKeywordToUrl();
}

onMounted(() => {
  mounted.value = true;
  syncKeywordFromUrl();
  if (props.autofocus) inputEl.value?.focus({ preventScroll: true });
});
</script>

<template>
  <form class="news-search" role="search" @submit.prevent="onSubmit">
    <!-- 降级提示：用普通元素而非 <noscript>，避免 SSR 与客户端 DOM 不一致导致 hydration 警告 -->
    <p class="news-search-noscript">
      本站搜索需要启用 JavaScript。你可以使用
      <a :href="withBase('/atom.xml')">RSS 订阅</a> 获取最新日志。
    </p>
    <template v-if="mounted">
      <span class="news-search-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </span>
      <input
        ref="inputEl"
        :value="value"
        type="search"
        name="q"
        placeholder="检索日志标题、正文与标签…"
        aria-label="检索站点内容"
        autocomplete="off"
        @input="onInput"
      />
    </template>
  </form>
</template>

<style scoped lang="scss">
@use '../styles/variables' as *;
@use '../styles/mixins' as *;

.news-search {
  position: relative;
  display: flex;
  align-items: center;
  margin: 0 0 18px;

  .news-search-noscript {
    display: none;
    padding: 0 2px;
    font-size: 14px;
    color: $ink-2;

    a {
      color: $accent-2;
      text-decoration: underline;
    }
  }

  .news-search-icon {
    position: absolute;
    left: 16px;
    top: 50%;
    display: flex;
    color: $ink-3;
    pointer-events: none;
    transform: translateY(-50%);

    svg {
      width: 18px;
      height: 18px;
    }
  }

  input {
    width: 100%;
    padding: 11px 18px 11px 44px;
    font-size: 14.5px;
    color: $ink;
    background: $card;
    border: 1px solid $line;
    border-left: 2px solid var(--accent);
    border-radius: 0;
    outline: none;
    transition: border-color 0.25s ease, box-shadow 0.25s ease;

    &::placeholder {
      color: $ink-3;
    }

    &:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 3px var(--accent-soft);
    }
  }
}

// 顶层 html 选择器 Vue scoped 不会加 data-v 前缀，仍能命中
html:not(.js) {
  .news-search {
    display: block;
    padding: 0;
    background: transparent;
    border: none;
  }

  .news-search-icon,
  .news-search input {
    display: none !important;
  }

  .news-search-noscript {
    display: block;
  }
}
</style>
