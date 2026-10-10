<script setup lang="ts">
import { computed, onMounted, shallowRef } from 'vue';
import CardGrid from './CardGrid.vue';
import { searchKeyword } from '@/composables/useSearch';
import type { Post } from '@/types';

const corpus = shallowRef<Post[]>([]);

onMounted(async () => {
  try {
    const mod = await import('@/postsSearch.data');
    corpus.value = mod.data;
  } catch {
    corpus.value = [];
  }
});

const tokens = computed(() => searchKeyword.value.toLowerCase().split(/\s+/).filter(Boolean));

const hits = computed(() => {
  if (!tokens.value.length) return [];
  return corpus.value.filter((post) => {
    const haystack = [
      post.title,
      post.description,
      post.categories.join(' '),
      post.tags.join(' '),
      post.content ?? '',
    ].map((text) => text.toLowerCase());
    return tokens.value.every((token) => haystack.some((text) => text.includes(token)));
  });
});

const stats = computed(() => {
  const keyword = searchKeyword.value.trim();
  if (!keyword) return '输入关键词，检索全部日志标题与正文。';
  if (!hits.value.length) return `未找到与「${keyword}」相关的日志。`;
  return `找到 ${hits.value.length} 条与「${keyword}」相关的结果`;
});
</script>

<template>
  <p class="search-tip" aria-live="polite">{{ stats }}</p>
  <CardGrid v-if="tokens.length" :posts="hits" empty-text="未找到相关日志" />
</template>

<style scoped lang="scss">
@use '../styles/variables' as *;

.search-tip {
  margin: 8px 0 16px;
  font-family: $font-mono;
  font-size: 13px;
  letter-spacing: 0.3px;
  color: $ink-3;
}
</style>
