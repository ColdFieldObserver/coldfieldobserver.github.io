<script setup lang="ts">
import ChipsNav from '../ChipsNav.vue';
import CardGrid from '../CardGrid.vue';
import Pagination from '../Pagination.vue';
import type { Post } from '@/types';

// 列表页通用外壳：标题 + 快捷入口 + 卡片网格 + 分页
defineProps<{
  title: string;
  posts: Post[];
  current: number;
  totalPages: number;
  firstHref: string;
  pagePrefix: string;
  /** 隐藏分类/标签/归档快捷入口（分类、标签详情页使用） */
  hideChips?: boolean;
}>();
</script>

<template>
  <div class="news-list">
    <!-- 页面级顶部插槽（如列表页的搜索入口） -->
    <slot name="top" />

    <div class="list-head">
      <h1 class="list-title">{{ title }}</h1>
      <ChipsNav v-if="!hideChips" />
    </div>

    <CardGrid :posts="posts" empty-text="暂无日志" />

    <Pagination
      :current="current"
      :total-pages="totalPages"
      :first-href="firstHref"
      :page-prefix="pagePrefix"
    />
  </div>
</template>

<style scoped lang="scss">
@use '../../styles/variables' as *;
@use '../../styles/mixins' as *;

.news-list {
  max-width: $max-w;
  margin: 0 auto;
}

.list-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 20px;
}

// 页面主标题（搜索 / 归档 / 分类索引 / 标签索引页保持一致）
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

@include respond-below($bp-sm) {
  .list-head {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
