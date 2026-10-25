<script setup lang="ts">
import { computed } from 'vue';
import { collectTerms, useAllPosts } from '~/composables/usePosts';

const all = useAllPosts();
const terms = computed(() => collectTerms('categories', all.value));

useHead({ title: '分类' });
</script>

<template>
  <TermIndexPage kind="categories" :terms="terms" :total="all.length" />
</template>
