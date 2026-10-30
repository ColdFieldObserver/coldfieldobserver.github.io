<script setup lang="ts">
import { setupScrollReveal } from '~/composables/useScrollReveal';
import { initTheme } from '~/composables/useTheme';

// ============================================================
// 全站壳层：顶栏 + 左右固定栏 + 唯一滚动容器
//   注意：这里不能用顶层 await —— layout 不在 <Suspense> 内，
//   异步 setup 会让客户端 hydration 一直挂起（表现为页面卡死）。
// ============================================================
const nuxtApp = useNuxtApp();
const {
  progress,
  active: progressActive,
  done: progressDone,
  completeRendering,
  start: startProgress,
  markPageLoaded,
} = usePageProgress();

// 站内跳转的真实加载进度（首屏不再有全屏 loader，只保留这条细进度条）
const offLoadingStart = nuxtApp.hook('page:loading:start', () => startProgress(false));
const offLoadingEnd = nuxtApp.hook('page:loading:end', () => markPageLoaded());

/** 切页时复位唯一滚动容器（带锚点的跳转交给页内锚点逻辑） */
function resetScroller(): void {
  if (import.meta.server) return;
  if (window.location.hash) return;
  document.querySelector<HTMLElement>('.site-main')?.scrollTo({ top: 0, behavior: 'auto' });
}

const offPageFinish = nuxtApp.hook('page:finish', () => {
  setupScrollReveal();
  completeRendering();
});
const offTransitionFinish = nuxtApp.hook('page:transition:finish', resetScroller);

onMounted(() => {
  initTheme();
  resetScroller();
  setupScrollReveal();
  completeRendering();
});

onBeforeUnmount(() => {
  offPageFinish();
  offTransitionFinish();
  offLoadingStart();
  offLoadingEnd();
});
</script>

<template>
  <PageProgress :progress="progress" :active="progressActive" :done="progressDone" />
  <ReadingProgress />
  <SiteHeader />
  <SiteSidebar />

  <!-- 主内容地标：浏览器阅读模式据此定位正文，忽略侧栏等噪声 -->
  <main id="content" class="site-main" role="main">
    <slot />
  </main>

  <SiteRightBar />
  <BackToTop />
  <SearchDialog />
</template>
