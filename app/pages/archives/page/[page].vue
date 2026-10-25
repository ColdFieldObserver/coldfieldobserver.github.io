<script setup lang="ts">
import { computed } from 'vue';
import { useAllPosts } from '~/composables/usePosts';

const route = useRoute();
const all = useAllPosts();
const page = computed(() => Number(route.params.page) || 1);

useHead({ title: computed(() => `归档 · 第 ${page.value} 页`) });
</script>

<template>
  <ArchivePage :posts="all" :page="page" />
</template>
