<script setup lang="ts">
import { useAllPosts } from '~/composables/usePosts';

const all = useAllPosts();
useHead({ title: '归档' });
</script>

<template>
  <ArchivePage :posts="all" :page="1" />
</template>
