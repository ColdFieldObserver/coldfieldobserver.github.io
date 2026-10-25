<script setup lang="ts">
import { setupScrollReveal } from '~/composables/useScrollReveal';
import { initTheme } from '~/composables/useTheme';

// ============================================================
// 全站壳层：开机动画 + 顶栏 + 左右固定栏 + 唯一滚动容器
//   注意：这里不能用顶层 await —— layout 不在 <Suspense> 内，
//   异步 setup 会让客户端 hydration 一直挂起（表现为页面卡死）。
// ============================================================
const nuxtApp = useNuxtApp();

/** 切页时复位唯一滚动容器（带锚点的跳转交给页内锚点逻辑） */
function resetScroller(): void {
  if (import.meta.server) return;
  if (window.location.hash) return;
  document.querySelector<HTMLElement>('.site-main')?.scrollTo({ top: 0, behavior: 'auto' });
}

const offPageFinish = nuxtApp.hook('page:finish', () => setupScrollReveal());
const offTransitionFinish = nuxtApp.hook('page:transition:finish', resetScroller);

onMounted(() => {
  initTheme();
  resetScroller();
  setupScrollReveal();
});

onBeforeUnmount(() => {
  offPageFinish();
  offTransitionFinish();
});
</script>

<template>
  <MechaLoader />
  <SiteHeader />
  <SiteSidebar />

  <!-- 主内容地标：浏览器阅读模式据此定位正文，忽略侧栏等噪声 -->
  <main id="content" class="site-main" role="main">
    <slot />
  </main>

  <SiteRightBar />
  <SearchDialog />
</template>
