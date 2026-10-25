<script setup lang="ts">
import { computed } from 'vue';
import { useAllPosts } from '~/composables/usePosts';

const route = useRoute();
const all = useAllPosts();

// 页面在 <Suspense> 内，允许顶层 await；只取当前文章，不拉全站正文
const { data: post } = await useAsyncData(`post:${route.path}`, () =>
  queryCollection('posts').path(route.path).first(),
);

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: '文章不存在', fatal: true });
}

const index = computed(() => all.value.findIndex((item) => item.url === route.path));
const prev = computed(() => (index.value > 0 ? all.value[index.value - 1] : undefined));
const next = computed(() =>
  index.value >= 0 && index.value < all.value.length - 1 ? all.value[index.value + 1] : undefined,
);

/** 文章头部的元信息（日期 + 分类 + 标签） */
const meta = computed(() => ({
  date: all.value[index.value]?.date ?? '',
  categories: all.value[index.value]?.categories ?? [],
  tags: all.value[index.value]?.tags ?? [],
}));

useHead({ title: post.value.title });
</script>

<template>
  <article v-if="post" class="post-view">
    <header class="mb-6">
      <h1 class="post-title">{{ post.title }}</h1>
      <div class="post-meta">
        <time>{{ meta.date }}</time>
        <NuxtLink
          v-for="category in meta.categories"
          :key="category"
          class="mecha-tag"
          :to="`/categories/${category}`"
        >
          {{ category }}
        </NuxtLink>
        <NuxtLink v-for="tag in meta.tags" :key="tag" class="mecha-tag" :to="`/tags/${tag}`">
          #{{ tag }}
        </NuxtLink>
      </div>
    </header>

    <div class="post-content">
      <ContentRenderer :value="post" />
    </div>

    <nav class="mt-8 flex justify-between gap-4 border-t border-line pt-5" aria-label="上下篇">
      <NuxtLink v-if="prev" class="max-w-[46%] text-[14px] text-accent-2 hover:underline" :to="prev.url">
        ← {{ prev.title }}
      </NuxtLink>
      <span v-else />
      <NuxtLink
        v-if="next"
        class="ml-auto max-w-[46%] text-right text-[14px] text-accent-2 hover:underline"
        :to="next.url"
      >
        {{ next.title }} →
      </NuxtLink>
    </nav>

    <section class="mt-8" aria-label="评论">
      <GiscusComments />
    </section>
  </article>
</template>
