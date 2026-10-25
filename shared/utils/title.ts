import { SITE } from '../site';

// ============================================================
// 页面标题后缀
//
// VitePress 会按 titleTemplate 给每个页面标题追加站点名，Nuxt 没有这层
// 自动模板，迁移后 <title> 只剩裸标题（「关于」「归档」…）。这里统一补上
// `· 冷域观者的个人网站`，并在 app.vue 注册成全局 titleTemplate，
// 这样漏写标题或走 error.vue 时也不会漏出裸标题。
// ============================================================

/** 与站点全名之间用中点分隔 */
const SUFFIX = `· ${SITE.title}`;

/**
 * 给页面标题补上站点后缀。
 * 已经包含站点全名的（如首页）原样返回，避免出现
 * 「冷域观者的个人网站 · 冷域观者的个人网站」这种重复。
 */
export function withSiteSuffix(title?: string | null): string {
  const text = String(title ?? '').trim();
  if (!text) return SITE.title;
  if (text.includes(SITE.title)) return text;
  return `${text} ${SUFFIX}`;
}
