// ============================================================
// 全站滚动淡入
//   元素进入视口时从下方推入。
// 纯渐进增强：禁用 JS / 不支持 IntersectionObserver / 开启了系统级
// 「减少动态效果」时完全不介入，元素保持默认可见。
// ============================================================

/** 是否开启了系统级「减少动态效果」 */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/** 需要淡入的「块级元素容器」 */
interface RevealGroup {
  selector: string;
  /** 是否向下穿透 VitePress 的 wrapper，取真正承载块级元素的容器 */
  drill?: boolean;
  /** 子项的逐个延迟（毫秒），用于卡片网格的错落感 */
  stagger?: number;
}

const REVEAL_GROUPS: RevealGroup[] = [
  { selector: '.post-content', drill: true }, // 文章正文
  { selector: '.card-grid', stagger: 45 }, // 列表页卡片
  { selector: '.feature-grid', stagger: 45 }, // 首页特性卡
  { selector: '.post-list', stagger: 30 }, // 归档时间轴
  { selector: '.term-grid', stagger: 40 }, // 分类索引卡片
  { selector: '.tool-grid', stagger: 45 }, // 工具卡片
  { selector: '.about-layout', drill: true, stagger: 40 }, // 关于页
  { selector: '.home-flow', stagger: 40 }, // 首页流程
];

const GROUP_SELECTOR = REVEAL_GROUPS.map((group) => group.selector).join(',');

const BLOCK_TAGS = new Set([
  'H1',
  'H2',
  'H3',
  'H4',
  'H5',
  'H6',
  'P',
  'UL',
  'OL',
  'DL',
  'PRE',
  'TABLE',
  'BLOCKQUOTE',
  'HR',
  'FIGURE',
  'DETAILS',
]);

function hasBlockChild(node: HTMLElement): boolean {
  return Array.from(node.children).some(
    (el) => BLOCK_TAGS.has(el.tagName) || (el as HTMLElement).classList.contains('post-toc'),
  );
}

function resolveBlockContainer(root: HTMLElement): HTMLElement {
  let node = root;
  while (!hasBlockChild(node) && node.children.length === 1) {
    node = node.children[0] as HTMLElement;
  }
  return node;
}

let observer: IntersectionObserver | null = null;
let pending: HTMLElement[] = [];
let scrollBound = false;
let safetyTimer: number | null = null;

function usesDocumentScroll(): boolean {
  return window.matchMedia('(max-width: 1024px)').matches;
}

function getViewportBottom(scroller: HTMLElement): number {
  return usesDocumentScroll() ? window.innerHeight : scroller.getBoundingClientRect().bottom;
}

/**
 * 滚动兜底：瞬时锚点定位、浏览器滚动恢复等会「跳过」中间内容，
 * 这些块从未与视口相交，IntersectionObserver 不会回调，会一直停在
 * opacity: 0。这里在滚动容器上再挂一个节流检查补齐。
 */
function bindScrollSafety(): void {
  if (scrollBound || typeof window === 'undefined') return;
  const scroller = document.querySelector<HTMLElement>('.site-main');
  if (!scroller) return;
  scrollBound = true;
  const scrollTarget: HTMLElement | Window = usesDocumentScroll() ? window : scroller;
  scrollTarget.addEventListener(
    'scroll',
    () => {
      if (safetyTimer !== null) return;
      safetyTimer = window.setTimeout(() => {
        safetyTimer = null;
        revealPassed();
      }, 120);
    },
    { passive: true },
  );
}

/** 收集所有需要淡入的块（去重） */
function collectBlocks(): HTMLElement[] {
  const blocks: HTMLElement[] = [];
  const seen = new Set<HTMLElement>();
  for (const group of REVEAL_GROUPS) {
    for (const root of Array.from(document.querySelectorAll<HTMLElement>(group.selector))) {
      const container = group.drill ? resolveBlockContainer(root) : root;
      let index = 0;
      for (const child of Array.from(container.children)) {
        if (!(child instanceof HTMLElement) || child.offsetHeight <= 0) continue;
        if (seen.has(child)) continue;
        // 容器保持可见，动画交给它的子项，避免嵌套时的套娃效果
        if (child.matches(GROUP_SELECTOR)) continue;
        seen.add(child);
        if (group.stagger) {
          // 轻微错落；上限 5 档，避免长列表越滚越慢
          child.style.transitionDelay = `${Math.min(index, 5) * group.stagger}ms`;
        }
        index += 1;
        blocks.push(child);
      }
    }
  }
  return blocks;
}

/** 挂载滚动淡入（每次路由切换后调用） */
export function setupScrollReveal(): void {
  if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') return;
  observer?.disconnect();
  observer = null;
  pending = [];
  if (prefersReducedMotion()) return;

  const scroller = document.querySelector<HTMLElement>('.site-main');
  if (!scroller) return;
  bindScrollSafety();

  const blocks = collectBlocks();
  if (!blocks.length) return;

  const viewportBottom = getViewportBottom(scroller);
  const current = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-revealed');
        current.unobserve(entry.target);
      }
    },
    { root: usesDocumentScroll() ? null : scroller, rootMargin: '0px 0px -8% 0px', threshold: 0 },
  );
  observer = current;

  for (const block of blocks) {
    block.classList.add('reveal');
    if (block.getBoundingClientRect().top < viewportBottom) {
      block.classList.add('is-revealed');
    } else {
      pending.push(block);
      current.observe(block);
    }
  }
}

/** 补齐「已经被滚过、但没经过视口」的块 */
export function revealPassed(): void {
  if (!pending.length) return;
  const scroller = document.querySelector<HTMLElement>('.site-main');
  if (!scroller) return;
  const viewportBottom = getViewportBottom(scroller);
  const rest: HTMLElement[] = [];
  for (const block of pending) {
    if (block.getBoundingClientRect().top < viewportBottom) {
      block.classList.add('is-revealed');
      observer?.unobserve(block);
    } else {
      rest.push(block);
    }
  }
  pending = rest;
}
