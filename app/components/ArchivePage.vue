<script setup lang="ts">
import { computed } from 'vue';
import type { Post } from '#shared/types/post';

// 归档：一年一页（与 build/post-index 的分页口径一致）
const props = defineProps<{ posts: Post[]; page: number }>();

/** 所有年份（倒序） */
const years = computed(() => {
  const set = new Set(props.posts.map((post) => post.date.slice(0, 4)));
  return [...set].filter(Boolean).sort((a, b) => b.localeCompare(a));
});

const totalPages = computed(() => Math.max(1, years.value.length));
const currentYear = computed(() => years.value[props.page - 1] ?? '');
const yearPosts = computed(() =>
  props.posts.filter((post) => post.date.startsWith(currentYear.value)),
);

/** 按月份分组（同一年内） */
const months = computed(() => {
  const map = new Map<string, Post[]>();
  for (const post of yearPosts.value) {
    const month = post.date.slice(5, 7);
    const list = map.get(month) ?? [];
    list.push(post);
    map.set(month, list);
  }
  return [...map.entries()]
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([month, list]) => ({ month: `${Number(month)} 月`, list }));
});
</script>

<template>
  <div class="mx-auto max-w-page">
    <header class="mb-6 border-b border-line pb-4">
      <h1 class="mecha-title">归档</h1>
      <p class="mt-2 text-[13px] text-ink-3">
        共 {{ posts.length }} 篇 · {{ totalPages }} 个年份 · 第 {{ page }} / {{ totalPages }} 页
      </p>
    </header>

    <h2 v-if="currentYear" class="mb-4 flex items-baseline gap-2">
      <span class="font-mono text-[26px] leading-none font-extrabold text-ink">{{ currentYear }}</span>
      <span class="text-[13px] text-ink-3">年 · {{ yearPosts.length }} 篇</span>
    </h2>

    <p v-if="!months.length" class="py-11 text-center text-[14.5px] text-ink-3">暂无归档内容</p>

    <div v-else class="flex flex-col gap-6">
      <section v-for="group in months" :key="group.month">
        <h3 class="mb-3 font-mono text-[13px] tracking-[1px] text-accent-2">{{ group.month }}</h3>
        <CardGrid :posts="group.list" />
      </section>
    </div>

    <Pagination
      :current="page"
      :total-pages="totalPages"
      first-href="/archives/"
      page-prefix="/archives/page/"
    />
  </div>
</template>
