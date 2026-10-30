import tailwindcss from '@tailwindcss/vite';
import { buildRoutes } from './build/post-index';

// ============================================================
// 冷域观者的个人网站 · Nuxt 站点配置
//   - 纯静态站点：`nuxt generate` 产出 .output/public，部署 GitHub Pages
//   - 内容由 @nuxt/content v3 驱动（content/posts/*.md）
//   - 样式为原生 CSS + Tailwind v4（@theme 令牌），沿用 [data-theme] 三态机制
//   - 不引入 Nuxt UI：组件保持手写，图标用 @nuxt/icon 构建期内联
// ============================================================
export default defineNuxtConfig({
  compatibilityDate: '2026-10-01',
  ssr: true,
  devtools: { enabled: false },

  modules: ['@nuxt/content', '@nuxt/icon'],

  app: {
    baseURL: '/',
    head: {
      htmlAttrs: { lang: 'zh-CN' },
      // 默认标题：页面各自 useHead 覆盖，error.vue / 404 等没有设标题时兜底
      title: '冷域观者的个人网站',
      meta: [
        { name: 'author', content: 'ColdFieldObserver' },
        {
          name: 'keywords',
          content:
            'ColdFieldObserver, 冷域观者, 逃少音乐档案馆, 逃跑吧少年背景音乐, CFObserver, 在线工具, Base64, Unicode, 时间戳, URL编码, 蛋仔派对',
        },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://cdn.jsdelivr.net', crossorigin: '' },
        // Giscus 评论区在文章页底部，懒加载触发时才注入 iframe；
        // 预连接可省掉首次展开评论时的 DNS + TCP + TLS 握手
        { rel: 'preconnect', href: 'https://giscus.app' },
        // 字体全部走 CDN，仓库不保留字体文件：
        //   HarmonyOS Sans SC（400/500/700，unicode-range 分片）+ Cascadia Code（代码块）
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/npm/harmonyos-sans-sc-webfont-splitted@1.1.0/dist/Regular.css',
        },
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/npm/harmonyos-sans-sc-webfont-splitted@1.1.0/dist/Medium.css',
        },
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/npm/harmonyos-sans-sc-webfont-splitted@1.1.0/dist/Bold.css',
        },
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/npm/@fontsource/cascadia-code@5.2.3/index.min.css',
        },
        {
          rel: 'alternate',
          type: 'application/atom+xml',
          title: '冷域观者的个人网站 · Atom 订阅',
          href: '/atom.xml',
        },
        {
          rel: 'alternate',
          type: 'application/rss+xml',
          title: '冷域观者的个人网站 · RSS 订阅',
          href: '/rss.xml',
        },
      ],
      script: [
        // 首帧同步脚本：把用户选择的主题写进 <html data-theme>，避免深色首屏闪白。
        // storage key 与 app/composables/useTheme.ts 保持一致。
        {
          innerHTML:
            'try{var t=localStorage.getItem("cfo-theme")||"auto";document.documentElement.setAttribute("data-theme",t)}catch(e){document.documentElement.setAttribute("data-theme","auto")}',
          tagPriority: 'critical',
        },
        // 首帧同步脚本：DOM 解析时立即给 <html> 加 .js。
        // 禁用 JS 时此脚本不执行，所有 html:not(.js) 的降级规则自动生效。
        {
          innerHTML: 'document.documentElement.classList.add("js");',
          tagPriority: 'critical',
        },
      ],
    },
    // 保住 .page-enter-from / .page-leave-to 等类名（见 animation.css）
    pageTransition: { name: 'page', mode: 'out-in', appear: true },
  },

  css: ['katex/dist/katex.min.css', '~/assets/styles/main.css'],

  // 内容渲染：目录深度、双主题代码高亮、数学公式（KaTeX 替代旧的 mathjax3）
  content: {
    build: {
      markdown: {
        toc: { depth: 3, searchDepth: 3 },
        highlight: {
          theme: { default: 'github-light', dark: 'github-dark' },
          langs: [
            'bash',
            'css',
            'diff',
            'html',
            'js',
            'json',
            'md',
            'scss',
            'shell',
            'ts',
            'vue',
            'xml',
            'yaml',
          ],
        },
        remarkPlugins: { 'remark-math': {} },
        rehypePlugins: { 'rehype-katex': {} },
      },
    },
  },

  // 组件按文件名注册（<ListView> / <PostCard> …），模板保持零改动
  components: [{ path: '~/components', pathPrefix: false }],

  // 图标：只用本地 @iconify-json 集合，构建期直接内联 SVG。
  // 动态绑定（:name="item.icon"）扫描不到，必须显式登记。
  icon: {
    serverBundle: { collections: ['lucide', 'simple-icons'] },
    clientBundle: {
      scan: true,
      sizeLimitKb: 256,
      icons: [
        'lucide:arrow-right',
        'lucide:arrow-up',
        'lucide:check',
        'lucide:chevron-right',
        'lucide:copy',
        'lucide:folder',
        'lucide:hash',
        'lucide:house',
        'lucide:info',
        'lucide:menu',
        'lucide:monitor',
        'lucide:moon',
        'lucide:newspaper',
        'lucide:panel-right',
        'lucide:rss',
        'lucide:search',
        'lucide:sun',
        'lucide:wrench',
        'lucide:x',
        'simple-icons:bilibili',
        'simple-icons:github',
      ],
    },
  },

  vite: {
    plugins: [tailwindcss()],
    // Tailwind v4 官方支持矩阵；低于此版本的自定义属性 / color-mix 会静默降级
    build: {
      cssTarget: ['chrome111', 'edge111', 'firefox128', 'safari16.4', 'ios16.4'],
    },
  },

  nitro: {
    prerender: {
      // 路由由 build/post-index.ts 显式枚举，不靠爬虫
      crawlLinks: false,
      failOnError: true,
      // /about → about.html（无尾斜杠、无子目录 index）
      autoSubfolderIndex: false,
    },
  },

  // 唯一的路由枚举入口：build/post-index.ts 在构建期读 frontmatter
  hooks: {
    'prerender:routes'(ctx) {
      for (const route of buildRoutes()) ctx.routes.add(route);
    },
  },

  experimental: {
    payloadExtraction: 'client',
  },
});
