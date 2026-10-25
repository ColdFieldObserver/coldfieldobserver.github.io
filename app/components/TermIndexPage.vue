<script setup lang="ts">
import { computed } from 'vue';
import type { Post, TermItem } from '#shared/types/post';

// 分类 / 标签索引页（kind 决定文案与路径）
const props = defineProps<{
  kind: 'categories' | 'tags';
  terms: TermItem[];
  total: number;
}>();

const title = computed(() => (props.kind === 'categories' ? '分类' : '标签'));
const unit = computed(() => (props.kind === 'categories' ? '个分类' : '个标签'));
</script>

<template>
  <div class="mx-auto max-w-page">
    <header class="mb-6 border-b border-line pb-4">
      <h1 class="mecha-title">{{ title }}</h1>
      <p class="mt-2 text-[13px] text-ink-3">共 {{ terms.length }} {{ unit }} · {{ total }} 篇文章</p>
    </header>

    <p v-if="!terms.length" class="py-11 text-center text-[14.5px] text-ink-3">暂无{{ title }}</p>

    <div v-else class="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
      <NuxtLink
        v-for="term in terms"
        :key="term.path"
        class="group mecha-clip-s flex items-center gap-3 border border-line bg-card px-4 py-3.5 transition-colors hover:border-edge hover:bg-accent-soft"
        :to="term.path"
      >
        <Icon
          :name="kind === 'categories' ? 'i-lucide-folder' : 'i-lucide-hash'"
          class="size-4 shrink-0 text-accent-2"
        />
        <span class="min-w-0 flex-1 truncate text-[14.5px] text-ink-2 group-hover:text-ink">
          {{ term.name }}
        </span>
        <span class="mecha-tag text-[11px]">{{ term.count }}</span>
      </NuxtLink>
    </div>
  </div>
</template>
