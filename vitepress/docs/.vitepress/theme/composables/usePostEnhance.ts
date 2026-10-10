import { nextTick } from 'vue';
import { initTheme, onThemeChange, resolvedDark } from './useTheme';
import { prefersReducedMotion, revealPassed } from './useScrollReveal';

// ============================================================
// 文章页客户端增强
//   1. [TOC] 目录：读取正文中已渲染的标题 id，生成可跳转目录
//   2. 页内锚点滚动：目录 / 脚注 / 标题锚点跳转时滚动 .site-main
//      （本站 body 设了 overflow:hidden，VitePress 内置的 window.scrollTo 无效）
//   3. Mermaid 图表：把 mermaid 代码块交给 mermaid 渲染为 SVG
//      （mermaid 体积大且含大量 chunk，改为运行时按需从 CDN 加载）
//   4. 代码块复制按钮：VitePress 只输出 <button class="copy">，自定义主题需自行接管
// 以上均依赖渲染后的真实 DOM，只能运行在浏览器端，且都是渐进增强。
// ============================================================

// ---- 代码块复制（全站只注册一次） ----
let copyBound = false;

function bindCopyButtons(): void {
  if (copyBound || typeof document === 'undefined') return;
  copyBound = true;
  document.addEventListener('click', async (event) => {
    const target = event.target as HTMLElement | null;
    const button = target?.closest<HTMLButtonElement>('button.copy');
    if (!button) return;
    const code = button.closest('div[class*="language-"]')?.querySelector('pre code');
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code.textContent ?? '');
      button.classList.add('copied');
      window.setTimeout(() => button.classList.remove('copied'), 1600);
    } catch {
      // 剪贴板不可用（非安全上下文 / 无权限）时静默降级
    }
  });
}

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
  const top =
    target.getBoundingClientRect().top -
    scroller.getBoundingClientRect().top +
    scroller.scrollTop -
    ANCHOR_OFFSET;
  const behavior = smooth && !prefersReducedMotion() ? 'smooth' : 'auto';
  scroller.scrollTo({ top: Math.max(0, top), behavior });
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
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement | null;
    const link = target?.closest<HTMLAnchorElement>('a[href^="#"]');
    if (!link) return;
    scrollToAnchor(link.getAttribute('href') ?? '');
  });
  window.addEventListener('hashchange', () => scrollToAnchor(window.location.hash));
}

// ---- Mermaid 图表 ----
interface MermaidEntry {
  el: HTMLElement;
  source: string;
}

let entries: MermaidEntry[] = [];
let drawnTheme: string | null = null;
let lastRoute = '';
let themeBound = false;

function currentTheme(): string {
  return resolvedDark.value ? 'dark' : 'neutral';
}

function collectMermaid(): boolean {
  if (entries.length) return true;
  const blocks = Array.from(
    document.querySelectorAll<HTMLElement>('.post-content div.language-mermaid'),
  );
  entries = blocks.map((block) => {
    const source = block.querySelector('code')?.textContent ?? '';
    const holder = document.createElement('div');
    holder.className = 'mermaid-holder';
    const pre = document.createElement('pre');
    pre.className = 'mermaid';
    pre.textContent = source;
    holder.appendChild(pre);
    block.replaceWith(holder);
    return { el: pre, source };
  });
  return entries.length > 0;
}

function restoreMermaid(): void {
  for (const entry of entries) {
    entry.el.parentElement?.classList.remove('mermaid-rendered');
    const pre = document.createElement('pre');
    pre.className = 'mermaid';
    pre.textContent = entry.source;
    entry.el.replaceWith(pre);
    entry.el = pre;
  }
}

const MERMAID_VERSION = '12.1.0';
const MERMAID_CDNS = [
  `https://cdn.jsdelivr.net/npm/mermaid@${MERMAID_VERSION}/dist/mermaid.min.js`,
  `https://unpkg.com/mermaid@${MERMAID_VERSION}/dist/mermaid.min.js`,
];

interface MermaidApi {
  initialize(config: Record<string, unknown>): void;
  run(options: { nodes: HTMLElement[] }): Promise<void>;
}

let mermaidPromise: Promise<MermaidApi> | null = null;

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      script.remove();
      reject(new Error(`Failed to load script: ${src}`));
    };
    document.head.appendChild(script);
  });
}

async function loadMermaid(): Promise<MermaidApi> {
  if (mermaidPromise) return mermaidPromise;
  mermaidPromise = (async () => {
    const injected = (window as unknown as { mermaid?: MermaidApi }).mermaid;
    if (injected) return injected;
    let lastError: unknown;
    for (const src of MERMAID_CDNS) {
      try {
        await loadScript(src);
        const api = (window as unknown as { mermaid?: MermaidApi }).mermaid;
        if (api) return api;
      } catch (error) {
        lastError = error;
      }
    }
    throw lastError ?? new Error('Mermaid CDN unavailable');
  })();
  mermaidPromise.catch(() => {
    mermaidPromise = null;
  });
  return mermaidPromise;
}

async function renderMermaid(): Promise<void> {
  if (!collectMermaid()) return;
  const theme = currentTheme();
  if (drawnTheme === theme) return;

  restoreMermaid();
  try {
    const mermaid = await loadMermaid();
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'loose',
      theme,
      fontFamily: 'inherit',
    });
    await mermaid.run({ nodes: entries.map((entry) => entry.el) });
    for (const entry of entries) entry.el.parentElement?.classList.add('mermaid-rendered');
    drawnTheme = theme;
  } catch {
    // 渲染失败时保留源码文本，不影响阅读
  }
}

function bindThemeListener(): void {
  if (themeBound || typeof window === 'undefined') return;
  themeBound = true;
  onThemeChange(() => void renderMermaid());
}

function reset(): void {
  entries = [];
  drawnTheme = null;
}

/**
 * 文章页挂载 / 路由切换后调用。
 * @param routeKey 当前文章标识（如 page.relativePath），变化时重置内部缓存
 */
export async function enhancePost(routeKey: string): Promise<void> {
  if (typeof document === 'undefined') return;
  initTheme();
  bindCopyButtons();
  bindAnchorScroll();
  bindThemeListener();
  if (routeKey !== lastRoute) {
    reset();
    lastRoute = routeKey;
  }
  await nextTick();
  fillToc();
  scrollToAnchor(window.location.hash, false);
  await renderMermaid();
  scrollToAnchor(window.location.hash, false);
}
