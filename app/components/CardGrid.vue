<script setup lang="ts">
import type { Post } from '#shared/types/post';

withDefaults(
  defineProps<{
    posts: Post[];
    emptyText?: string;
  }>(),
  { emptyText: '暂无内容' },
);
</script>

<template>
  <div class="grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-5 max-md:grid-cols-1">
    <p v-if="!posts.length" class="col-span-full py-11 text-center text-[14.5px] text-ink-3">
      {{ emptyText }}
    </p>
    <template v-else>
      <PostCard v-for="post in posts" :key="post.url" :post="post" />
    </template>
  </div>
</template>
