/**
 * 分类 / 标签 / 文章路径工具（前后端共用）。
 *
 * 注意：这里只做「路径拼接」，不做 percent-encode —— 中文 term 交给
 * 浏览器与 Nitro 自行处理；预先 encodeURIComponent 会让产物文件名变成
 * /%E5%85%AC... 的形式。需要放进 URL 组件时由调用方决定。
 */

/** 把 frontmatter 里的字符串 / 数组统一成字符串数组 */
export function toArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .filter((item) => item !== null && item !== undefined)
      .map(String)
      .filter((item) => item.trim() !== '');
  }
  if (value === null || value === undefined || value === '') return [];
  return [String(value)];
}

/** 分类 / 标签根路径，如 /categories/公告 */
export function termDir(kind: 'categories' | 'tags', name: string): string {
  return `/${kind}/${name}`;
}

/** 分类 / 标签第 1 页（与根路径相同，URL 无扩展名） */
export function termPath(kind: 'categories' | 'tags', name: string): string {
  return termDir(kind, name);
}

/** 分类 / 标签第 n(>=2) 页前缀，如 /categories/公告/page/ */
export function termPagePrefix(kind: 'categories' | 'tags', name: string): string {
  return `${termDir(kind, name)}/page/`;
}

/** 文章路由：/posts/<slug> */
export function postPath(slug: string): string {
  return `/posts/${slug}`;
}
