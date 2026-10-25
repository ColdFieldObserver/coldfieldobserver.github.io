import { nextTick } from 'vue';
import { initTheme } from '~/composables/useTheme';
import { prefersReducedMotion, revealPassed } from '~/composables/useScrollReveal';

// ============================================================
// 文章页客户端增强
//   1. [TOC] 目录：读取正文中已渲染的标题 id，生成可跳转目录
//   2. 页内锚点滚动：目录 / 脚注 / 标题锚点跳转时滚动对应的页面容器
//   3. 代码块的语言标签与复制按钮：由 components/content/ProsePre.vue 自己负责
//      （不再在这里用 VitePress 时代的 button.copy 选择器去猜 DOM）
// Mermaid 渲染已按参考站的做法移除：图表改用静态图片或外链，
// 避免整包 mermaid（数百 KB）在客户端从 CDN 加载。
// 以上均依赖渲染后的真实 DOM，只能运行在浏览器端，且都是渐进增强。
// ============================================================

// ---- [TOC] 目录 ----
function fillToc(): void {
  if (typeof document === 'undefined') return;
  const placeholders = document.querySelectorAll<HTMLElement>('[data-post-toc]');
  if (!placeholders.length) return;

  const content = document.querySelector('.post-content');
  if (!content) return;

  const headings = Array.from(content.querySelectorAll<HTMLElement>('h2[id], h3[id]'));
  const wrap = document.createElement('div');
  const title = document.createElement('p');
  title.className = 'post-toc-title';
  title.textContent = '// 目录';
  wrap.appendChild(title);

  const list = document.createElement('ul');
  list.className = 'post-toc-list';
  for (const heading of headings) {
    const text = (heading.textContent ?? '').replace(/\u200b/g, '').trim();
    if (!text) continue;
    const item = document.createElement('li');
    item.className = `post-toc-item level-${heading.tagName.slice(1)}`;
    const link = document.createElement('a');
    link.href = `#${heading.id}`;
    link.textContent = text;
    item.appendChild(link);
    list.appendChild(item);
  }
  wrap.appendChild(list);

  for (const placeholder of placeholders) {
    placeholder.replaceChildren(wrap.cloneNode(true));
  }
}

// ---- 页内锚点滚动 ----
const ANCHOR_OFFSET = 24;
const SETTLE_WINDOW = 2000;

let anchorBound = false;
/** 自建 hash 跳转后的一小段时间内忽略 hashchange，避免重复滚动 */
let suppressHashChangeUntil = 0;
let settleObserver: ResizeObserver | null = null;
let settleHash = '';
let settleDeadline = 0;

function alignToAnchor(hash: string, smooth: boolean): boolean {
  if (typeof document === 'undefined' || !hash || hash === '#') return false;
  const scroller = document.querySelector<HTMLElement>('.site-main');
  if (!scroller) return false;
  let id = hash.slice(1);
  try {
    id = decodeURIComponent(id);
  } catch {
    // 非法百分号编码时按原样查找
  }
  const target = document.getElementById(id);
  if (!target) return false;
  const behavior = smooth && !prefersReducedMotion() ? 'smooth' : 'auto';
  if (window.matchMedia('(max-width: 1024px)').matches) {
    const headerHeight = document.querySelector<HTMLElement>('.site-header')?.offsetHeight ?? 0;
    const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - ANCHOR_OFFSET;
    window.scrollTo({ top: Math.max(0, top), behavior });
  } else {
    const top =
      target.getBoundingClientRect().top -
      scroller.getBoundingClientRect().top +
      scroller.scrollTop -
      ANCHOR_OFFSET;
    scroller.scrollTo({ top: Math.max(0, top), behavior });
  }
  if (behavior === 'auto') revealPassed();
  return true;
}

/**
 * 跳转后的一小段时间内，若正文高度仍有变化（Mermaid、图片等迟到布局），
 * 目标会被顶偏，这里重新对齐一次。
 */
function watchAnchorSettle(hash: string): void {
  settleObserver?.disconnect();
  settleObserver = null;
  if (typeof window === 'undefined' || typeof ResizeObserver === 'undefined') return;
  const root = document.querySelector<HTMLElement>('.post-content');
  if (!root) return;
  settleHash = hash;
  settleDeadline = Date.now() + SETTLE_WINDOW;
  let lastHeight = root.offsetHeight;
  const observer = new ResizeObserver(() => {
    const height = root.offsetHeight;
    if (height === lastHeight) return;
    lastHeight = height;
    if (Date.now() > settleDeadline) {
      observer.disconnect();
      return;
    }
    alignToAnchor(settleHash, false);
  });
  settleObserver = observer;
  observer.observe(root);
}

function scrollToAnchor(hash: string, smooth = true): void {
  if (!alignToAnchor(hash, smooth)) return;
  watchAnchorSettle(hash);
}

function bindAnchorScroll(): void {
  if (anchorBound || typeof window === 'undefined') return;
  anchorBound = true;

  document.addEventListener('click', (event: MouseEvent) => {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = event.target as HTMLElement | null;
    const link = target?.closest<HTMLAnchorElement>('a[href^="#"]');
    if (!link) return;
    const hash = link.getAttribute('href') ?? '';
    if (!hash || hash === '#') return;

    // 关键：先阻止浏览器的默认 hash 跳转。
    // 默认跳转会把 .site-main 直接滚到元素顶部（不带头部偏移），
    // 紧接着我们的 alignToAnchor 再按 24px 偏移滚一次，
    // 两次滚动叠加就会让正文容器整体偏掉一截。
    event.preventDefault();

    // 用 replaceState 写 hash：不触发 hashchange，避免第二次重复滚动
    suppressHashChangeUntil = performance.now() + 150;
    try {
      history.replaceState(null, '', hash);
    } catch {
      // 忽略：history API 不可用时仍继续手动滚动
    }
    scrollToAnchor(hash);
  });

  window.addEventListener('hashchange', () => {
    // 上面 replaceState 之后浏览器不会再派发 hashchange；
    // 这里只处理外部直接改地址栏 / 手动点击原生锚点的情况
    if (performance.now() < suppressHashChangeUntil) return;
    scrollToAnchor(window.location.hash);
  });
}

// ---- 文章入口 ----
let lastRoute = '';

/**
 * 文章页挂载 / 路由切换后调用。
 *
 * 只做三件事：填目录、绑定锚点滚动、按 hash 精确对齐。
 * 代码块的语言标签与复制按钮由 components/content/ProsePre.vue 自行负责，
 * Mermaid 渲染按参考站的做法已移除（图表改用静态图片或外链）。
 *
 * @param routeKey 当前文章标识（如 /posts/<slug>），变化时重置内部缓存
 */
export async function enhancePost(routeKey: string): Promise<void> {
  if (typeof document === 'undefined') return;
  initTheme();
  bindAnchorScroll();
  lastRoute = routeKey;
  await nextTick();
  fillToc();
  scrollToAnchor(window.location.hash, false);
}
