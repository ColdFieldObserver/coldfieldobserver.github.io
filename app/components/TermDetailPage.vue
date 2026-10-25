<script setup lang="ts">
import { computed } from 'vue';
import { usePagedPosts } from '~/composables/usePosts';
import { termPagePrefix, termPath } from '#shared/utils/term';
import type { Post } from '#shared/types/post';

// 分类 / 标签详情页（复用列表壳）
const props = defineProps<{
  kind: 'categories' | 'tags';
  name: string;
  page: number;
  posts: Post[];
}>();

const source = computed(() =>
  props.posts.filter((post) =>
    (props.kind === 'categories' ? post.categories : post.tags).includes(props.name),
  ),
);

const { pagePosts, totalPages, page } = usePagedPosts(
  () => props.page,
  () => source.value,
);

const title = computed(() =>
  props.kind === 'categories' ? `分类：${props.name}` : `标签：#${props.name}`,
);
const summary = computed(
  () => `共 ${source.value.length} 篇 · 第 ${page.value} / ${totalPages.value} 页`,
);

useHead({ title: title.value });
</script>

<template>
  <ListPage
    :title="title"
    :summary="summary"
    :posts="pagePosts"
    :current="page"
    :total-pages="totalPages"
    :first-href="termPath(kind, name)"
    :page-prefix="termPagePrefix(kind, name)"
    empty-text="该分类下暂无文章"
  />
</template>
