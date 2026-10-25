<script setup lang="ts">
import { computed } from 'vue';
import { collectTerms, useAllPosts } from '~/composables/usePosts';

const all = useAllPosts();
const terms = computed(() => collectTerms('tags', all.value));

useHead({ title: '标签' });
</script>

<template>
  <TermIndexPage kind="tags" :terms="terms" :total="all.length" />
</template>
