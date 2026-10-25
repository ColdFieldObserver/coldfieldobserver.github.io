<script setup lang="ts">
// 博客分区快捷入口
const CHIPS = [
  { label: '全部分类', to: '/categories/' },
  { label: '全部标签', to: '/tags/' },
  { label: '归档', to: '/archives/' },
] as const;
</script>

<template>
  <nav class="flex flex-wrap gap-2.5" aria-label="博客快捷入口">
    <NuxtLink
      v-for="chip in CHIPS"
      :key="chip.to"
      class="mecha-clip-dual border border-line bg-panel px-4 py-[5px] font-mono text-[12.5px] tracking-[0.5px] text-ink-2 transition-colors hover:border-accent hover:bg-accent hover:text-on-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55"
      :to="chip.to"
    >
      {{ chip.label }}
    </NuxtLink>
  </nav>
</template>
