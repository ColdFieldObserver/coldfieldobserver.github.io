<script setup lang="ts">
import { computed } from 'vue';
import { withBase } from 'vitepress';

const props = defineProps<{
  /** 当前页（从 1 开始） */
  current: number;
  /** 总页数 */
  totalPages: number;
  /** 第 1 页地址，如 /posts/ 、/archives/ 、/categories/公告.html */
  firstHref: string;
  /** 第 n(>=2) 页地址前缀 */
  pagePrefix: string;
}>();

const prevHref = computed(() =>
  props.current <= 2 ? props.firstHref : `${props.pagePrefix}${props.current - 1}`,
);
const nextHref = computed(() => `${props.pagePrefix}${props.current + 1}`);
</script>

<template>
  <nav v-if="totalPages > 1" class="pagination" role="navigation" aria-label="分页导航">
    <a v-if="current > 1" class="page-btn" :href="withBase(prevHref)">← 上一页</a>
    <span v-else class="page-btn disabled">← 上一页</span>
    <span class="page-info">{{ current }} / {{ totalPages }}</span>
    <a v-if="current < totalPages" class="page-btn" :href="withBase(nextHref)">下一页 →</a>
    <span v-else class="page-btn disabled">下一页 →</span>
  </nav>
</template>

<style scoped lang="scss">
@use '../styles/variables' as *;
@use '../styles/mixins' as *;

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  margin-top: 30px;

  .page-btn {
    display: inline-block;
    padding: 7px 20px;
    font-family: $font-mono;
    font-size: 13px;
    letter-spacing: 0.5px;
    color: $accent-2;
    background: var(--accent-soft);
    border: 1px solid $line;
    clip-path: mecha-clip-dual(8px);
    transition: background 0.22s ease, color 0.22s ease, border-color 0.22s ease;

    &:hover {
      color: var(--on-accent);
      background: var(--accent);
      border-color: var(--accent);
    }

    &.disabled {
      color: $ink-3;
      background: transparent;
      border-color: $line;
      cursor: not-allowed;
      opacity: 0.6;

      &:hover {
        color: $ink-3;
        background: transparent;
        border-color: $line;
      }
    }
  }

  .page-info {
    font-family: $font-mono;
    font-size: 13px;
    color: $ink-3;
  }
}
</style>
