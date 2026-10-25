import { parsePostDate } from './date';
import { toArray } from './term';
import { SITE } from '../site';
import type { Post } from '../types/post';

// ============================================================
// 文章共用工具
//   @nuxt/content 查询结果 → 前端统一使用的轻量 Post
// ============================================================

/** content 文档里本文件用到的字段（避免依赖生成类型的细节） */
export interface PostDoc {
  path: string;
  title?: string | null;
  date?: string | null;
  description?: string | null;
  cover?: string | null;
  categories?: string[] | null;
  tags?: string[] | null;
  stickypost?: boolean | null;
}

/** 原始条目 → 轻量 Post（不含正文，供列表 / 侧栏 / 上下篇使用） */
export function toBasePost(doc: PostDoc): Post {
  const date = parsePostDate(doc.date);
  return {
    title: doc.title ?? '',
    // content 的 path 就是站内路由（/posts/<slug>）
    url: doc.path,
    date: formatPostDay(date, doc.date),
    timestamp: date ? date.getTime() : 0,
    // 未指定或非 true 一律视为不置顶
    stickypost: doc.stickypost === true,
    categories: toArray(doc.categories),
    tags: toArray(doc.tags),
    cover: doc.cover || '/images/default_cover.svg',
    description: doc.description ?? '',
  };
}

/** YYYY-MM-DD（UTC，与 frontmatter 中书写的一致，不因构建机时区漂移） */
function formatPostDay(date: Date | null, fallback: unknown): string {
  if (!date) return String(fallback ?? '');
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** 按时间倒序（置顶优先级由消费方按需处理） */
export function byDateDesc(a: Post, b: Post): number {
  return b.timestamp - a.timestamp;
}

/** Markdown → 纯文本（本地检索语料用） */
export function stripMarkdown(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^\s*>\s?/gm, '')
    .replace(/[*_~|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** 站内绝对地址（用于 SEO / feed） */
export function absoluteUrl(pathname: string): string {
  return new URL(pathname, SITE.mainUrl).href;
}

/** 资源绝对地址（外链 / data: 原样返回） */
export function absoluteAsset(src: string): string {
  if (/^(?:[a-z][a-z0-9+.-]*:)?\/\//i.test(src) || src.startsWith('data:')) return src;
  return new URL(src, SITE.mainUrl).href;
}
