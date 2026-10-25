<script setup lang="ts">
import { useAllPosts } from '~/composables/usePosts';

const route = useRoute();
const all = useAllPosts();
const name = computed(() => String(route.params.name ?? ''));
</script>

<template>
  <TermDetailPage kind="categories" :name="name" :page="1" :posts="all" />
</template>
