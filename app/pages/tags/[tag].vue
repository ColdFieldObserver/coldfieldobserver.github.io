<script setup lang="ts">
import { computed } from 'vue';
import { useAllPosts } from '~/composables/usePosts';

const route = useRoute();
const all = useAllPosts();
const name = computed(() => String(route.params.tag ?? ''));
</script>

<template>
  <TermDetailPage kind="tags" :name="name" :page="1" :posts="all" />
</template>
