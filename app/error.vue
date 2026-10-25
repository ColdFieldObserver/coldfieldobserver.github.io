<script setup lang="ts">
import type { NuxtError } from '#app';

// 自定义错误页：保留站点外壳，正文统一展示 404 视图，避免暴露堆栈
const props = defineProps<{ error: NuxtError }>();

// 错误页的 useHead 不经过 app.vue 的 titleTemplate，这里直接写完整标题
const ERROR_TITLE = '404 · 信号丢失 · 冷域观者的个人网站';
useHead({ title: ERROR_TITLE });

if (import.meta.dev && props.error?.statusCode !== 404) {
  console.error(props.error);
}
</script>

<template>
  <NuxtLayout>
    <div class="mx-auto max-w-3xl p-10">
      <h1 class="text-2xl font-bold">404 · 信号丢失</h1>
      <p class="mt-3 text-sm opacity-70">页面不存在。</p>
    </div>
  </NuxtLayout>
</template>
