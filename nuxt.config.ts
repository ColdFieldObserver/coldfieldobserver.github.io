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
      meta: [
        { name: 'author', content: 'ColdFieldObserver' },
        {
          name: 'keywords',
          content:
            'ColdFieldObserver, 冷域观者, 逃少音乐档案馆, 逃跑吧少年背景音乐, CFObserver, 在线工具, Base64, Unicode, 时间戳, URL编码, 蛋仔派对',
        },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/images/favicon.svg' },
        { rel: 'preconnect', href: 'https://cdn.jsdelivr.net', crossorigin: '' },
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
        // 首帧同步脚本：只有「本次会话第一次进入」才允许显示开机动画。
        // 关键在于它由 JS 写入 —— 禁用 JS 时 html.booting 不会存在，
        // 全屏 loader 因此永不出现（旧实现默认渲染，无 JS 时整页空白）。
        {
          innerHTML:
            'try{if(!sessionStorage.getItem("cfo-booted")){document.documentElement.classList.add("booting");sessionStorage.setItem("cfo-booted","1")}}catch(e){}',
          tagPriority: 'critical',
        },
      ],
    },
    // 保住 .page-enter-from / .page-leave-to 等类名（见 animation.css）
    pageTransition: { name: 'page', mode: 'out-in', appear: true },
  },

  css: ['katex/dist/katex.min.css', '~/assets/styles/main.css'],

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
        'lucide:chevron-right',
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
