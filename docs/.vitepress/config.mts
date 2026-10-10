import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import deflist from 'markdown-it-deflist';
import footnote from 'markdown-it-footnote';
import mark from 'markdown-it-mark';
import sub from 'markdown-it-sub';
import sup from 'markdown-it-sup';
import taskLists from 'markdown-it-task-lists';
import { createContentLoader, defineConfig, type HeadConfig } from 'vitepress';
import { SITE } from './theme/config';

// ============================================================
// 部署路径（base）
//   本站部署于 GitHub Pages 用户主页 coldfieldobserver.github.io，根路径发布。
// ============================================================
const BASE = '/';

const SITE_TITLE = '冷域观者的个人网站';
const SITE_DESC =
  '冷域观者的个人网站 · 机甲重构版：提供在线工具、资源导航与博客日志（支持 RSS 订阅与全站检索）。';

/** feed 收录条数 */
const FEED_LIMIT = 20;

function xmlEscape(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** 由页面相对路径推导线上绝对地址（cleanUrls=false，非 index 页以 .html 结尾） */
function absolutePageUrl(relativePath: string): string {
  const route = relativePath.replace(/index\.md$/, '').replace(/\.md$/, '.html');
  return new URL(route, `${SITE.mainUrl}/`).href;
}

/** 站内相对 / 绝对图片地址 → 线上绝对地址（外链与 data URI 原样返回） */
function absoluteAssetUrl(src: string | undefined): string | null {
  if (!src) return null;
  if (/^(?:https?:)?\/\//i.test(src) || src.startsWith('data:')) return src;
  return new URL(src.startsWith('/') ? src : `/${src}`, `${SITE.mainUrl}/`).href;
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'zh-CN',
  title: SITE_TITLE,
  description: SITE_DESC,
  // 把日志列表页源目录（docs/blog/）映射到 /posts/ URL 路径：
  //   docs/blog/index.md        → /posts/
  //   docs/blog/page/[page].md  → /posts/page/[page].html
  // 正文文章 docs/posts/*.md 的 URL 仍为 /posts/<slug>.html，
  // 两者因形式不同（目录 vs. 具体文件）不会互相冲突。
  rewrites: {
    'blog/index.md': 'posts/index.md',
    'blog/page/:page.md': 'posts/page/:page.md',
  },
  head: [
    // <head> 同步脚本：在首帧渲染前把用户选择的主题写入 <html data-theme>，
    // 避免「先浅后深」的闪烁（FOUC）。storage key 与 useTheme.ts 保持一致。
    [
      'script',
      {},
      'try{var t=localStorage.getItem("cfo-theme")||"auto";document.documentElement.setAttribute("data-theme",t)}catch(e){document.documentElement.setAttribute("data-theme","auto")}',
    ],
    // <head> 同步脚本：在 DOM 解析时立即给 <html> 加 .js 标记。
    // 浏览器禁用 JS 时此脚本不执行，html:not(.js) 的降级 CSS 自动生效。
    ['script', {}, 'document.documentElement.classList.add("js");'],
    ['meta', { name: 'author', content: SITE.author }],
    [
      'meta',
      {
        name: 'keywords',
        content:
          'ColdFieldObserver, 冷域观者, 逃少音乐档案馆, 逃跑吧少年背景音乐, CFObserver, 在线工具, Base64, Unicode, 时间戳, URL编码, 蛋仔派对',
      },
    ],
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${BASE}images/favicon.svg` }],
    // Atom / RSS feed 自动发现
    [
      'link',
      {
        rel: 'alternate',
        type: 'application/atom+xml',
        title: `${SITE_TITLE} · Atom 订阅`,
        href: `${BASE}atom.xml`,
      },
    ],
    [
      'link',
      {
        rel: 'alternate',
        type: 'application/rss+xml',
        title: `${SITE_TITLE} · RSS 订阅`,
        href: `${BASE}rss.xml`,
      },
    ],
  ],
  base: BASE,
  cleanUrls: false,
  // Markdown 扩展：脚注 / 任务列表 / 上下标 / 高亮 / 定义列表 / 数学公式 / [TOC]。
  markdown: {
    math: true,
    config(md) {
      md.use(footnote)
        .use(taskLists, { labelAfter: true })
        .use(sub)
        .use(sup)
        .use(mark)
        .use(deflist)
        .use((m) => {
          // [TOC] → 目录占位容器；真实目录由 enhancePost 在客户端按渲染后的
          // 标题 id 生成，避免与标题锚点的 slugify 规则不一致而跳转失效
          m.core.ruler.push('toc_placeholder', (state) => {
            const tokens = state.tokens;
            for (let i = 0; i < tokens.length; i++) {
              const open = tokens[i];
              const inline = tokens[i + 1];
              const close = tokens[i + 2];
              if (
                open.type === 'paragraph_open' &&
                inline?.type === 'inline' &&
                inline.content.trim() === '[TOC]' &&
                close?.type === 'paragraph_close'
              ) {
                open.type = 'html_block';
                open.tag = '';
                open.nesting = 0;
                open.content = '<div class="post-toc" data-post-toc></div>';
                open.children = [];
                tokens.splice(i + 1, 2);
              }
            }
            return true;
          });
        });
    },
  },
  // 动态路由页面标题在构建期细化，利于 SEO
  transformPageData(pageData) {
    const params = (pageData as { params?: Record<string, string> }).params;
    if (!params) return;
    const layout = pageData.frontmatter?.layout;
    if (layout === 'category' && params.category) {
      pageData.title = `分类：${params.category}`;
    } else if (layout === 'tag' && params.tag) {
      pageData.title = `标签：${params.tag}`;
    }
    if (params.page && Number(params.page) > 1) {
      pageData.title = `${pageData.title ?? SITE_TITLE} · 第 ${params.page} 页`;
    }
  },
  // 阅读模式 / 社交分享会读取 Open Graph 与 article:* 元数据，这里为文章页补齐
  transformHead({ pageData, title, description }) {
    const frontmatter = (pageData.frontmatter ?? {}) as Record<string, any>;
    const isPost = pageData.relativePath.startsWith('posts/');
    const url = absolutePageUrl(pageData.relativePath);
    const pageTitle = (isPost ? frontmatter.title : undefined) || title;

    const head: HeadConfig[] = [
      ['meta', { property: 'og:site_name', content: SITE_TITLE }],
      ['meta', { property: 'og:type', content: isPost ? 'article' : 'website' }],
      ['meta', { property: 'og:title', content: pageTitle }],
      ['meta', { property: 'og:url', content: url }],
      ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
      ['meta', { name: 'twitter:title', content: pageTitle }],
    ];
    if (description) {
      head.push(['meta', { property: 'og:description', content: description }]);
      head.push(['meta', { name: 'twitter:description', content: description }]);
    }

    if (!isPost) return head;

    const published = frontmatter.date ? new Date(frontmatter.date) : null;
    const publishedISO =
      published && !Number.isNaN(published.getTime()) ? published.toISOString() : undefined;
    const cover = absoluteAssetUrl(frontmatter.cover) ?? absoluteAssetUrl('/images/default_cover.svg');

    if (publishedISO) {
      head.push(['meta', { property: 'article:published_time', content: publishedISO }]);
    }
    head.push(['meta', { property: 'article:author', content: SITE.author }]);
    const tags: string[] = Array.isArray(frontmatter.tags)
      ? frontmatter.tags
      : frontmatter.tags
        ? [frontmatter.tags]
        : [];
    for (const tag of tags) {
      head.push(['meta', { property: 'article:tag', content: tag }]);
    }
    if (cover) head.push(['meta', { property: 'og:image', content: cover }]);

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: frontmatter.title ?? title,
      description: frontmatter.description ?? description ?? '',
      mainEntityOfPage: url,
      inLanguage: 'zh-CN',
      author: { '@type': 'Person', name: SITE.author, url: SITE.mainUrl },
      publisher: {
        '@type': 'Person',
        name: SITE.author,
        url: SITE.mainUrl,
      },
      ...(publishedISO ? { datePublished: publishedISO, dateModified: publishedISO } : {}),
      ...(cover ? { image: [cover] } : {}),
    };
    head.push(['script', { type: 'application/ld+json' }, JSON.stringify(jsonLd)]);

    return head;
  },
  vite: {
    // 使用 Sass 现代 JS API（Vite 5.4+），避免 Dart Sass 2.0 移除 legacy API 后构建失败
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern',
          // 让 .vue 里的 scoped <style lang="scss"> 直接 @use 'variables' / @use 'mixins'
          loadPaths: [fileURLToPath(new URL('./theme/styles', import.meta.url))],
        },
      },
    },
    // CSS 压缩目标（关键）：未设置 cssTarget 时 Vite 会把媒体查询重写为范围语法
    // `width<=820px`，旧内核（Chrome/Edge <104、Safari/iOS <16.4）会整块丢弃响应式规则。
    build: {
      cssTarget: ['chrome103', 'edge103', 'firefox101', 'safari16.3', 'ios16.3'],
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./theme', import.meta.url)),
      },
    },
  },
  async buildEnd(siteConfig) {
    // ----------------------------------------------------------------
    // 构建期生成 Atom（/atom.xml）与 RSS（/rss.xml）订阅源
    // ----------------------------------------------------------------
    const posts = await createContentLoader('posts/*.md', { render: true }).load();

    const entries = posts
      .map((post) => ({
        url: post.url,
        html: post.html ?? '',
        frontmatter: post.frontmatter as Record<string, any>,
      }))
      .sort((a, b) => +new Date(b.frontmatter.date) - +new Date(a.frontmatter.date))
      .slice(0, FEED_LIMIT);

    const absolute = (route: string) => new URL(route, SITE.mainUrl).href;
    const toRfc822 = (value: unknown): string => new Date(value as string).toUTCString();
    const updatedISO = entries[0]
      ? new Date(entries[0].frontmatter.date).toISOString()
      : new Date().toISOString();

    // ---- Atom ----
    const atomItems = entries
      .map((entry) => {
        const link = absolute(entry.url);
        return [
          '  <entry>',
          `    <title>${xmlEscape(entry.frontmatter.title)}</title>`,
          `    <link href="${xmlEscape(link)}" />`,
          `    <id>${xmlEscape(link)}</id>`,
          `    <updated>${new Date(entry.frontmatter.date).toISOString()}</updated>`,
          entry.frontmatter.description
            ? `    <summary>${xmlEscape(entry.frontmatter.description)}</summary>`
            : '',
          `    <content type="html">${xmlEscape(entry.html)}</content>`,
          '  </entry>',
        ]
          .filter(Boolean)
          .join('\n');
      })
      .join('\n');

    const atom = [
      '<?xml version="1.0" encoding="utf-8"?>',
      '<feed xmlns="http://www.w3.org/2005/Atom">',
      `  <title>${xmlEscape(SITE_TITLE)}</title>`,
      `  <subtitle>${xmlEscape(SITE_DESC)}</subtitle>`,
      `  <link href="${xmlEscape(absolute('/atom.xml'))}" rel="self" />`,
      `  <link href="${xmlEscape(SITE.mainUrl)}" />`,
      `  <id>${xmlEscape(SITE.mainUrl)}</id>`,
      `  <updated>${updatedISO}</updated>`,
      `  <author><name>${xmlEscape(SITE.author)}</name></author>`,
      atomItems,
      '</feed>',
      '',
    ].join('\n');

    // ---- RSS 2.0 ----
    const rssItems = entries
      .map((entry) => {
        const link = absolute(entry.url);
        return [
          '    <item>',
          `      <title>${xmlEscape(entry.frontmatter.title)}</title>`,
          `      <link>${xmlEscape(link)}</link>`,
          `      <guid isPermaLink="true">${xmlEscape(link)}</guid>`,
          `      <pubDate>${toRfc822(entry.frontmatter.date)}</pubDate>`,
          entry.frontmatter.description
            ? `      <description>${xmlEscape(entry.frontmatter.description)}</description>`
            : '',
          `      <content:encoded><![CDATA[${entry.html}]]></content:encoded>`,
          '    </item>',
        ]
          .filter(Boolean)
          .join('\n');
      })
      .join('\n');

    const rss = [
      '<?xml version="1.0" encoding="utf-8"?>',
      '<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">',
      '  <channel>',
      `    <title>${xmlEscape(SITE_TITLE)}</title>`,
      `    <link>${xmlEscape(SITE.mainUrl)}</link>`,
      `    <description>${xmlEscape(SITE_DESC)}</description>`,
      `    <language>zh-CN</language>`,
      `    <lastBuildDate>${toRfc822(updatedISO)}</lastBuildDate>`,
      `    <atom:link href="${xmlEscape(absolute('/rss.xml'))}" rel="self" type="application/rss+xml" />`,
      rssItems,
      '  </channel>',
      '</rss>',
      '',
    ].join('\n');

    fs.writeFileSync(path.join(siteConfig.outDir, 'atom.xml'), atom, 'utf-8');
    fs.writeFileSync(path.join(siteConfig.outDir, 'rss.xml'), rss, 'utf-8');
  },
});
