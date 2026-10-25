import { computed, type ComputedRef, type Ref } from 'vue';
import { PAGE_SIZE } from '#shared/site';
import { byDateDesc } from '#shared/utils/post';
import { termPath } from '#shared/utils/term';
import type { Post, TermItem } from '#shared/types/post';

// ============================================================
// 文章数据访问
//
// 约定：带 useState() 的函数只能在 setup 顶层的同步代码里调用。
// 不要放进 computed / 模板 / 事件回调 —— 那样会在渲染期反复 inject。
// 因此这里把「取状态」与「算派生数据」拆开：
//   const all = useAllPosts();
//   const terms = computed(() => collectTerms('tags', all.value));
// ============================================================

/** 全站共用的文章列表状态（由 plugins/posts.ts 在应用启动时填一次） */
export function useAllPosts(): Ref<Post[]> {
  return useState<Post[]>('posts:all', () => []);
}

/** 拉取并规范化全部文章（时间倒序）。已填充时直接复用。 */
export async function fetchAllPosts(): Promise<Ref<Post[]>> {
  const posts = useAllPosts();
  if (posts.value.length) return posts;

  // SSR 阶段必须用 useRequestFetch 才能发相对地址
  const fetcher = import.meta.server ? useRequestFetch() : $fetch;
  const list = await fetcher<Post[]>(withBase('/api/posts.json'));

  posts.value = (list ?? []).sort(byDateDesc);
  return posts;
}

export interface PagedPosts {
  /** 全部文章（置顶优先 + 时间倒序） */
  allPosts: ComputedRef<Post[]>;
  /** 总页数（至少 1） */
  totalPages: ComputedRef<number>;
  /** 当前页（已按上下界收敛） */
  page: ComputedRef<number>;
  /** 当前页文章 */
  pagePosts: ComputedRef<Post[]>;
}

/**
 * 置顶优先排序：stickypost 为 true 的文章整体前移。
 * Array#sort 是稳定排序，因此置顶组内部与其余文章都保持原有的时间倒序。
 * 仅用于按时间倒序的列表页；归档时间轴与搜索结果按原顺序展示。
 */
export function pinnedFirst(posts: Post[]): Post[] {
  return [...posts].sort((a, b) => Number(b.stickypost) - Number(a.stickypost));
}

/**
 * 列表分页组合式函数。
 * @param getCurrent 当前页取值函数（响应式）
 * @param getSource  数据集取值函数，默认全部文章
 */
export function usePagedPosts(
  getCurrent: () => number,
  getSource: () => Post[] = () => useAllPosts().value,
): PagedPosts {
  const allPosts = computed(() => pinnedFirst(getSource()));
  const totalPages = computed(() => Math.max(1, Math.ceil(allPosts.value.length / PAGE_SIZE)));
  const page = computed(() => {
    const raw = Math.floor(Number(getCurrent()));
    if (!Number.isFinite(raw) || raw < 1) return 1;
    return Math.min(raw, totalPages.value);
  });
  const pagePosts = computed(() =>
    allPosts.value.slice((page.value - 1) * PAGE_SIZE, page.value * PAGE_SIZE),
  );

  return { allPosts, totalPages, page, pagePosts };
}

/** 统计分类 / 标签集合（按文章数倒序） */
export function collectTerms(kind: 'categories' | 'tags', posts: Post[]): TermItem[] {
  const counter = new Map<string, number>();
  for (const post of posts) {
    const names = kind === 'categories' ? post.categories : post.tags;
    for (const name of names) {
      counter.set(name, (counter.get(name) ?? 0) + 1);
    }
  }
  return [...counter.entries()]
    .map(([name, count]) => ({ name, count, path: termPath(kind, name) }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

/** 取最新 n 篇文章（侧栏用，置顶不改变时间序） */
export function latestPosts(posts: Post[], n: number): Post[] {
  return posts.slice(0, n);
}
