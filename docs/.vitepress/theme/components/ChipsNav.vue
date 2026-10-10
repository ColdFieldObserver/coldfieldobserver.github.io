<script setup lang="ts">
import { withBase } from 'vitepress';

// 博客分区快捷入口
const CHIPS = [
  { label: '全部分类', href: '/categories/' },
  { label: '全部标签', href: '/tags/' },
  { label: '归档', href: '/archives/' },
] as const;
</script>

<template>
  <nav class="chips-nav" aria-label="博客快捷入口">
    <a v-for="chip in CHIPS" :key="chip.href" class="chip" :href="withBase(chip.href)">
      {{ chip.label }}
    </a>
  </nav>
</template>

<style scoped lang="scss">
@use '../styles/variables' as *;
@use '../styles/mixins' as *;

.chips-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  .chip {
    padding: 5px 16px;
    font-family: $font-mono;
    font-size: 12.5px;
    letter-spacing: 0.5px;
    color: $ink-2;
    background: $panel;
    border: 1px solid $line;
    clip-path: mecha-clip-dual(7px);
    transition: color 0.22s ease, background 0.22s ease, border-color 0.22s ease;
    @include focus-ring;

    &:hover {
      color: var(--on-accent);
      background: var(--accent);
      border-color: var(--accent);
    }
  }
}
</style>
