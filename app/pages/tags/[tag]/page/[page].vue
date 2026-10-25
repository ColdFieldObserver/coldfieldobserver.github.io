<script setup lang="ts">
import { computed } from 'vue';
import { useAllPosts } from '~/composables/usePosts';

const route = useRoute();
const all = useAllPosts();
const name = computed(() => String(route.params.tag ?? ''));
const page = computed(() => Number(route.params.page) || 1);
</script>

<template>
  <TermDetailPage kind="tags" :name="name" :page="page" :posts="all" />
</template>
