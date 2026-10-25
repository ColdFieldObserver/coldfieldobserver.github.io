<script setup lang="ts">
import { withSiteSuffix } from '#shared/utils/title';

// ============================================================
// 全局标题模板：所有页面标题统一补「· 冷域观者的个人网站」后缀
//   VitePress 时期由 titleTemplate 自动完成，Nuxt 需要显式注册。
//   已含站点全名的标题（首页）不会重复追加，见 withSiteSuffix。
// ============================================================
useHead({
  titleTemplate: (title) => withSiteSuffix(title),
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
