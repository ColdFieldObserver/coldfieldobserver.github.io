<script setup lang="ts">
import { computed } from 'vue';
import { withBase } from 'vitepress';
import type { Post } from '@/types';

const props = defineProps<{ post: Post }>();

const coverSrc = computed(() => {
  const cover = props.post.cover;
  if (!cover) return withBase('/images/default_cover.svg');
  if (/^(?:https?:|data:)/i.test(cover)) return cover;
  return withBase(cover.startsWith('/') ? cover : `/${cover}`);
});
</script>

<template>
  <a class="post-card" :href="withBase(post.url)">
    <div class="card-cover">
      <span v-if="post.stickypost" class="pin-badge">置顶</span>
      <img :src="coverSrc" :alt="post.title" loading="lazy" />
    </div>

    <div class="card-body">
      <div class="card-meta">
        <time class="card-date">{{ post.date }}</time>
        <span v-for="tag in post.tags.slice(0, 2)" :key="tag" class="card-chip">#{{ tag }}</span>
      </div>

      <h3 class="card-title">{{ post.title }}</h3>
      <p v-if="post.description" class="card-desc">{{ post.description }}</p>

      <span class="card-more">
        读取数据
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M5 12h14" />
          <path d="M12 5l7 7-7 7" />
        </svg>
      </span>
    </div>
  </a>
</template>

<style scoped lang="scss">
@use '../styles/variables' as *;
@use '../styles/mixins' as *;

.post-card {
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: $card;
  border: 1px solid $line;
  clip-path: mecha-clip($cut-l);
  transition: border-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
  @include focus-ring;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: $accent-grad;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.32s cubic-bezier(0.22, 1, 0.36, 1);
  }

  &:hover {
    border-color: $edge;
    transform: translateY(-3px);
    box-shadow: $shadow-brand;

    &::before {
      transform: scaleX(1);
    }

    .card-more {
      color: var(--accent);

      svg {
        transform: translateX(4px);
      }
    }

    .card-cover img {
      transform: scale(1.05);
    }
  }

  .card-cover {
    position: relative;
    aspect-ratio: 16 / 8;
    overflow: hidden;
    background: var(--accent-soft);
    border-bottom: 1px solid $line;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.45s ease;
    }
  }

  .pin-badge {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 1;
    padding: 2px 10px;
    font-family: $font-mono;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 1px;
    color: var(--on-accent);
    background: $accent-grad;
    clip-path: mecha-clip-dual(6px);
  }

  .card-body {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 8px;
    padding: 15px 18px 17px;
  }

  .card-meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    font-family: $font-mono;
    font-size: 11.5px;
    letter-spacing: 0.4px;
    color: $ink-3;
  }

  .card-chip {
    color: $accent-2;
  }

  .card-title {
    font-size: 16px;
    font-weight: 600;
    line-height: 1.5;
    color: $ink;
    @include clamp-lines(2);
  }

  .card-desc {
    flex: 1;
    font-size: 13.5px;
    line-height: 1.65;
    color: $ink-2;
    @include clamp-lines(3);
  }

  .card-more {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-top: 2px;
    font-family: $font-mono;
    font-size: 12px;
    letter-spacing: 1px;
    color: $accent-2;
    transition: color 0.22s ease;

    svg {
      width: 15px;
      height: 15px;
      transition: transform 0.22s ease;
    }
  }
}
</style>
