<script setup lang="ts">
import { computed } from 'vue';
import { withBase } from 'vitepress';
import Pagination from '../Pagination.vue';
import { allPosts, usePagedPosts } from '@/composables/usePosts';
import type { Post } from '@/types';

const props = defineProps<{ page: number }>();

// 归档：按时间倒序展示全部文章，支持分页
const { pagePosts, page, totalPages } = usePagedPosts(() => props.page);

/** 按年份分组，形成时间轴 */
const groups = computed(() => {
  const map = new Map<string, Post[]>();
  for (const post of pagePosts.value) {
    const year = post.date.slice(0, 4) || '未知';
    if (!map.has(year)) map.set(year, []);
    map.get(year)!.push(post);
  }
  return [...map.entries()];
});
</script>

<template>
  <div class="archive-view">
    <h1 class="list-title">归档</h1>
    <p class="archive-total">共 {{ allPosts.length }} 篇日志</p>

    <div v-for="[year, posts] in groups" :key="year" class="archive-group">
      <h2 class="archive-year">{{ year }}</h2>
      <ul class="post-list">
        <li v-for="post in posts" :key="post.url" class="post-row">
          <a class="row-link" :href="withBase(post.url)">
            <span class="row-title">{{ post.title }}</span>
            <time class="row-date">{{ post.date }}</time>
          </a>
        </li>
      </ul>
    </div>

    <Pagination
      :current="page"
      :total-pages="totalPages"
      first-href="/archives/"
      page-prefix="/archives/page/"
    />
  </div>
</template>

<style scoped lang="scss">
@use '../../styles/variables' as *;
@use '../../styles/mixins' as *;

.archive-view {
  max-width: 860px;
  margin: 0 auto;
}

// 页面主标题（与列表 / 搜索 / 分类索引页保持一致）
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

.archive-total {
  margin: 10px 0 8px;
  font-family: $font-mono;
  font-size: 12.5px;
  letter-spacing: 1px;
  color: $ink-3;
}

.archive-group {
  margin-top: 26px;
}

.archive-year {
  margin-bottom: 8px;
  font-family: $font-mono;
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 2px;
  color: $accent-2;
}

.post-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.post-row {
  border-bottom: 1px dashed $line;

  &:last-child {
    border-bottom: none;
  }

  .row-link {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 13px 8px;
    color: inherit;
    transition: background 0.22s ease, padding-left 0.22s ease;

    &:hover {
      background: var(--accent-soft);
      padding-left: 14px;

      .row-title {
        color: var(--accent);
      }
    }

    .row-title {
      font-size: 15px;
      font-weight: 500;
      line-height: 1.5;
      color: $ink;
      transition: color 0.22s ease;
    }

    .row-date {
      flex-shrink: 0;
      font-family: $font-mono;
      font-size: 12.5px;
      color: $ink-3;
    }
  }
}
</style>
