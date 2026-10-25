<script setup lang="ts">
import { onMounted } from 'vue';
import { syncKeywordFromUrl } from '~/composables/useSearch';

// 直达搜索页：关键词与弹窗共享
onMounted(syncKeywordFromUrl);
useHead({ title: '全站检索' });
</script>

<template>
  <div class="mx-auto max-w-page">
    <header class="mb-6 border-b border-line pb-4">
      <h1 class="mecha-title">全站检索</h1>
      <p class="mt-2 text-[13px] text-ink-3">支持多个关键词（空格分隔），匹配标题、正文、分类与标签</p>
    </header>
    <SearchBox autofocus />
    <SearchResults />
  </div>
</template>
