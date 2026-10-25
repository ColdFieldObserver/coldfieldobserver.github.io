<script setup lang="ts">
import { computed } from 'vue';
import type { Post } from '#shared/types/post';

const props = defineProps<{ post: Post }>();

const coverSrc = computed(() => {
  const cover = props.post.cover;
  if (!cover) return withBase('/images/default_cover.svg');
  if (/^(?:https?:|data:)/i.test(cover)) return cover;
  return withBase(cover.startsWith('/') ? cover : `/${cover}`);
});
</script>

<template>
  <!--
    悬浮反馈只有「描边 + 外发光 + 封面轻微缩放 + 顶部高光条展开」，
    不再做位移：链接右移那类动效在长列表里会抖，也已按要求移除。
  -->
  <NuxtLink
    class="group mecha-clip-l relative flex flex-col overflow-hidden border border-line bg-card transition-[border-color,box-shadow] duration-200 before:absolute before:inset-x-0 before:top-0 before:z-1 before:h-0.5 before:origin-left before:scale-x-0 before:bg-accent before:transition-transform before:duration-300 before:content-[''] hover:border-edge hover:shadow-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55 group-hover:before:scale-x-100"
    :to="post.url"
  >
    <div class="relative aspect-[2/1] overflow-hidden border-b border-line bg-accent-soft">
      <span
        v-if="post.stickypost"
        class="mecha-tag absolute top-2.5 left-2.5 z-1 bg-panel/90 backdrop-blur-sm"
      >
        置顶
      </span>
      <img
        :src="coverSrc"
        :alt="post.title"
        loading="lazy"
        decoding="async"
        class="size-full object-cover transition-transform duration-[450ms] group-hover:scale-[1.05]"
      />
    </div>

    <div class="flex flex-1 flex-col gap-2 p-4">
      <div class="flex flex-wrap items-center gap-2 font-mono text-[11.5px] text-ink-3">
        <time>{{ post.date }}</time>
        <span v-for="tag in post.tags.slice(0, 2)" :key="tag" class="mecha-tag text-[11px]">
          #{{ tag }}
        </span>
      </div>

      <h3 class="line-clamp-2 text-[16.5px] leading-[1.45] font-bold text-ink">{{ post.title }}</h3>
      <p v-if="post.description" class="line-clamp-2 text-[13.5px] leading-[1.6] text-ink-3">
        {{ post.description }}
      </p>

      <span
        class="mt-auto flex items-center gap-1 font-mono text-[12px] text-accent-2 transition-colors group-hover:text-accent"
      >
        读取数据
        <Icon name="i-lucide-arrow-right" class="size-3.5" aria-hidden="true" />
      </span>
    </div>
  </NuxtLink>
</template>
