<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

// ============================================================
// 阅读进度条
// ------------------------------------------------------------
// 只对「长文」出现：取页面里最高的 <article>，高度超过视口 1.5 倍才算长文，
// 列表页的短卡片不触发。
//
// 站点 window 不滚动，滚动发生在 .site-main（见 router.options.ts），
// 因此监听该容器的 scroll（rAF 节流），并按它相对视口的偏移换算进度。
// 层级刻意压在 .page-progress（z-index: 1001 的路由加载条）下一层：
// 路由切换瞬间由加载条显示，加载完成后自然交还给阅读条。
// ============================================================

/** 最短可视高度比：低于此值不算「长文」 */
const LONG_ARTICLE_RATIO = 1.5;

const percent = ref(0);
const visible = ref(false);

const route = useRoute();

let scroller: HTMLElement | null = null;
let frame = 0;
let resizeObserver: ResizeObserver | null = null;

function measure(): void {
  if (!scroller) return;
  const viewHeight = scroller.clientHeight || window.innerHeight;
  const articles = document.querySelectorAll<HTMLElement>('.site-main article, article');
  let article: HTMLElement | null = null;
  let articleHeight = 0;
  for (const element of articles) {
    const height = element.getBoundingClientRect().height;
    if (height > articleHeight) {
      article = element;
      articleHeight = height;
    }
  }

  const isLong = Boolean(article && articleHeight > viewHeight * LONG_ARTICLE_RATIO);
  if (visible.value !== isLong) visible.value = isLong;
  if (!isLong || !article) {
    percent.value = 0;
    return;
  }

  const scrollerTop = scroller.getBoundingClientRect().top;
  const articleTop = article.getBoundingClientRect().top - scrollerTop;
  const range = articleHeight - viewHeight;
  const scrolled = Math.min(Math.max(-articleTop, 0), Math.max(range, 1));

  // 文章比视口长不了多少时，用「顶部是否已划出」兜底，避免进度条乱跳
  let value = range > 40 ? (scrolled / range) * 100 : articleTop < -4 ? 100 : 0;
  // 还在页面顶部时不显示任何进度（此时文章标题区刚出现）
  if (scroller.scrollTop < 40) value = 0;

  percent.value = Math.round(Math.min(Math.max(value, 0), 100) * 10) / 10;
}

function onScroll(): void {
  if (frame) return;
  frame = window.requestAnimationFrame(() => {
    frame = 0;
    measure();
  });
}

function attach(): void {
  scroller = document.querySelector<HTMLElement>('.site-main');
  if (!scroller) return;
  scroller.addEventListener('scroll', onScroll, { passive: true });
  // 图片 / 字体到位后文章高度会变，重算一次
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(onScroll);
    resizeObserver.observe(scroller.firstElementChild ?? scroller);
  }
  measure();
}

function detach(): void {
  scroller?.removeEventListener('scroll', onScroll);
  scroller = null;
  resizeObserver?.disconnect();
  resizeObserver = null;
  if (frame) {
    window.cancelAnimationFrame(frame);
    frame = 0;
  }
}

onMounted(attach);

// 站内跳转后文章高度与滚动位置都变了，等新页 DOM 落定再量一次
watch(
  () => route.fullPath,
  () => {
    percent.value = 0;
    requestAnimationFrame(measure);
  },
);

onBeforeUnmount(detach);
</script>

<template>
  <div
    class="reading-progress"
    :class="{ 'is-visible': visible && percent > 0 }"
    :style="{ width: `${percent}%` }"
    aria-hidden="true"
  />
</template>

<style scoped>
/* 与 .page-progress 同位不同层：同一渐变，天然衔接 */
.reading-progress {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 0;
  height: 3px;
  pointer-events: none;
  border-radius: 0 2px 2px 0;
  background: linear-gradient(90deg, var(--brand), var(--brand-deep) 45%, #ff7a00);
  opacity: 0;
}

@media (prefers-reduced-motion: no-preference) {
  .reading-progress {
    transition: opacity 0.4s var(--ease-inout), width 0.12s linear;
  }
}

.reading-progress.is-visible {
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .reading-progress {
    transition: opacity 0.01ms;
  }
}
</style>
