<script setup lang="ts">
import { withBase } from 'vitepress';
import { collectTerms } from '@/composables/usePosts';

const terms = collectTerms('tags');
</script>

<template>
  <div class="terms-view">
    <h1 class="list-title">标签</h1>

    <div class="term-cloud">
      <a v-for="term in terms" :key="term.name" class="tag-chip" :href="withBase(term.path)">
        #{{ term.name }}
        <span class="term-count">{{ term.count }}</span>
      </a>
      <p v-if="!terms.length" class="empty-state">暂无标签</p>
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

// 页面主标题（与列表 / 搜索 / 归档 / 分类索引页保持一致）
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

.term-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 22px;

  .tag-chip {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 7px 18px;
    font-family: $font-mono;
    font-size: 13.5px;
    color: $ink-2;
    background: $card;
    border: 1px solid $line;
    clip-path: mecha-clip-dual(7px);
    transition: color 0.22s ease, background 0.22s ease, border-color 0.22s ease;
    @include focus-ring;

    &:hover {
      color: var(--on-accent);
      background: var(--accent);
      border-color: var(--accent);

      .term-count {
        color: var(--on-accent);
        opacity: 0.75;
      }
    }

    .term-count {
      font-size: 11.5px;
      color: $ink-3;
    }
  }
}

.empty-state {
  padding: 40px 0;
  font-size: 14.5px;
  color: $ink-3;
  text-align: center;
}
</style>
