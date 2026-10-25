import type { RouterConfig } from 'nuxt/schema';

// ============================================================
// 路由滚动行为
//
// body 设了 overflow:hidden，全站唯一的纵向滚动容器是 .site-main，
// 所以 window 滚动（vue-router 默认行为）完全无效。这里接管：
//   - 一律返回 false，禁止 window 滚动
//   - 普通跳转：把 .site-main 复位到顶部
//   - 浏览器前进 / 后退：还原离开该路由时的滚动位置
//   - 带 hash：不复位，交给 layout 在 page:finish 后对齐锚点
// ============================================================

/** 每个路由离开时的滚动位置（仅客户端；只服务于前进 / 后退体验） */
const scrollPositions = new Map<string, number>();

export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    if (import.meta.server) return false;

    const scroller = document.querySelector<HTMLElement>('.site-main');
    if (!scroller) return false;

    if (from.fullPath !== to.fullPath) {
      scrollPositions.set(from.fullPath, scroller.scrollTop);
    }

    if (savedPosition) {
      const top = scrollPositions.get(to.fullPath) ?? 0;
      requestAnimationFrame(() => {
        scroller.scrollTop = top;
      });
      return false;
    }

    if (to.hash) return false;

    scroller.scrollTop = 0;
    return false;
  },
};
