<script setup lang="ts">
import { withBase } from 'vitepress';
import { collectTerms } from '@/composables/usePosts';

const terms = collectTerms('categories');
</script>

<template>
  <div class="terms-view">
    <h1 class="list-title">分类</h1>

    <div class="term-grid">
      <a v-for="term in terms" :key="term.name" class="term-card" :href="withBase(term.path)">
        <span class="term-name">{{ term.name }}</span>
        <span class="term-count">{{ term.count }} 篇</span>
      </a>
      <p v-if="!terms.length" class="empty-state">暂无分类</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '../../styles/variables' as *;
@use '../../styles/mixins' as *;

.terms-view {
  max-width: 1000px;
  margin: 0 auto;
}

// 页面主标题（与列表 / 搜索 / 归档页保持一致）
.list-title {
  position: relative;
  padding-left: 12px;
  font-size: clamp(22px, 3.4vw, 30px);
  font-weight: 700;
  letter-spacing: 1px;
  color: $ink;

  &::before {
    content: '';
    position: absolute;
    top: 0.24em;
    bottom: 0.24em;
    left: 0;
    width: 4px;
    background: $accent-grad;
  }
}

.term-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 14px;
  margin-top: 22px;
}

.term-card {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 20px;
  background: $card;
  border: 1px solid $line;
  clip-path: mecha-clip($cut-m);
  transition: border-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
  @include focus-ring;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 2px;
    background: $accent-grad;
    transform: scaleY(0);
    transform-origin: top;
    transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  }

  &:hover {
    transform: translateY(-2px);
    border-color: $edge;
    box-shadow: $shadow-brand;

    &::before {
      transform: scaleY(1);
    }

    .term-name {
      color: var(--accent);
    }
  }

  .term-name {
    font-size: 15px;
    font-weight: 600;
    color: $ink;
    transition: color 0.22s ease;
  }

  .term-count {
    font-family: $font-mono;
    font-size: 12.5px;
    color: $ink-3;
  }
}

.empty-state {
  grid-column: 1 / -1;
  padding: 40px 0;
  font-size: 14.5px;
  color: $ink-3;
  text-align: center;
}

@include respond-below($bp-sm) {
  .term-grid {
    grid-template-columns: 1fr;
  }
}
</style>
