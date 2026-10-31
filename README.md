<div align="center">

# coldfieldobserver.github.io

![Last Commit](https://img.shields.io/github/last-commit/ColdFieldObserver/coldfieldobserver.github.io?label=Last%20Commit)
[![Nuxt](https://img.shields.io/badge/Nuxt-4.6.3-00DC82?logo=Nuxt&logoColor=white)](https://nuxt.com/)
[![Vue](https://img.shields.io/badge/Vue-3.544-4FC08D?logo=Vue.js&logoColor=white)](https://cn.vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0.2-3178C6?logo=TypeScript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.3.3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
![License](https://img.shields.io/badge/License-MIT-blue)
[![BiliBili](https://img.shields.io/badge/BiliBili-冷域观者-FF69B4?logo=bilibili&logoColor=F5F5F5)](https://space.bilibili.com/3632301571311734)
[![GitHub](https://img.shields.io/badge/GitHub-ColdFieldObserver-blue?logo=github&logoColor=F5F5F5)](https://github.com/ColdFieldObserver)

冷域观者的个人网站，使用 Nuxt 4 + @nuxt/content + TypeScript + Tailwind CSS 构建，通过 `nuxt generate` 静态生成（SSG）后部署到 GitHub Pages。机甲蓝视觉，无后端、无第三方统计脚本。

</div>

## 网站结构

- **首页**：`/`，自我介绍、站点模块入口、蛋仔派对 ID 与站点说明。
- **日志**：`/posts/`，由 @nuxt/content 驱动的内容区，支持分类 / 标签 / 归档分页、站内搜索与 Giscus 评论。
- **归档**：`/archives/`，按年分页、页内按月分组（月份可折叠）。
- **分类 / 标签**：`/categories/`、`/tags/`，索引页与各自的详情分页。
- **搜索**：`/search/`，与搜索弹窗共用关键词；语料是构建期固化的静态 JSON，纯前端匹配。
- **工具箱**：`/tools/`，Base64 / Unicode / 时间戳 / URL / 蛋仔派对地图文本 5 个纯前端小工具。
- **关于**：`/about`，站点说明、订阅方式与版权。

## 技术栈

- [Nuxt 4](https://nuxt.com/)（Vite 8 + Nitro 预渲染 + SSG）
- [@nuxt/content v3](https://content.nuxt.com/)（Markdown 内容库，MDC + Shiki 双主题）
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)（`@theme` 设计令牌 + 工具类；保留项目自建 reset，**不引 Preflight**）
- [@nuxt/icon](https://nuxt.com/modules/icon)（Lucide + Simple Icons，构建期内联为 SVG）
- [KaTeX](https://katex.org/)（数学公式，`remark-math` + `rehype-katex`）

> 没有引入 Nuxt UI：机甲风的切角、描边、外发光都是项目自己的 `@utility` 与语义类。

## 数据文件

- `content/posts/*.md` —— 全部文章（唯一内容源），frontmatter 字段见 `content.config.ts`。
- `app/data/rightSidebarContent.ts` —— 个人档案、友情链接、公告，侧栏与「关于」页共用。
- `shared/site.ts` —— 站点信息、工具清单、分页大小（`PAGE_SIZE`）、Giscus 配置。

## 构建步骤

1. [下载并安装 Node.js](https://nodejs.org/zh-cn)（建议 22 LTS）
2. 安装 `pnpm`：`npm install -g pnpm`（`pnpm --version` 可验证）
3. 在项目文件夹下执行 `pnpm install`
4. `pnpm dev` 启动开发服务器（默认 `http://localhost:3000`）
5. `pnpm build` 生成静态产物，输出在 **`.output/public`**

> [!TIP]
> 如果 `npm install` 安装较慢，可先执行 `npm config set registry https://registry.npmmirror.com` 切换至镜像源。

## 字体与图标

字体为 HarmonyOS Sans SC（400 / 500 / 700 三个字重，按 unicode-range 分片走 CDN）和 Cascadia Code（代码块等宽），通过 CDN 加载（样式表由 `nuxt.config.ts` 的 `app.head` 注入），仓库不保留字体文件。回退链顺序为 HarmonyOS Sans SC → PingFang SC …（定义见 `app/assets/styles/base.css` 的 `--font-ui`）。

图标使用 `@nuxt/icon`（Lucide + Simple Icons），图标集以 `@iconify-json/*` 本地安装，**构建期直接内联为 SVG**（`app.config.ts` 里 `icon.mode: 'svg'`），运行时不请求 Iconify API。

## 交互与动效

- 字体栈、交互过渡基线、品牌色选区与「无 JavaScript 降级」规则 —— `app/assets/styles/base.css`；
- 页面切换、`.site-main` 前若干子块的编排式入场、滚动淡入 —— `app/assets/styles/animation.css`（纯 CSS，遵循 `prefers-reduced-motion`）；
- 主题三态（跟随系统 / 浅色 / 深色）—— `app/composables/useTheme.ts`，`localStorage` key 为 `cfo-theme`，首帧由 `nuxt.config.ts` 的内联脚本落地，避免深色闪白；
- 长文阅读进度条、返回顶部浮钮、路由加载进度条 —— `ReadingProgress.vue` / `BackToTop.vue` / `PageProgress.vue`（首屏没有全屏加载动画）；
- `Ctrl / ⌘ + K` 或 `/` 打开搜索 —— `app/plugins/shortcuts.client.ts`（输入框内与输入法组合中不劫持）；
- 移动端（≤1024px）左右抽屉 + 拖拽手势，遮罩透明度跟手 —— `app/composables/useMobileDrawer.ts`。

## Stone Badge

下面是这个仓库的[Stone Badge](https://stone.professorlee.work/)。

![Stone Badge](https://stone.professorlee.work/api/stone/ColdFieldObserver/coldfieldobserver.github.io)

## 关于冷域观者

一个逃跑吧少年和蛋仔派对玩家，偶尔也玩我的世界、PVZ2 和保卫萝卜4，同时是逃少音乐档案馆的主理人。曾用名 AsyncObserver、蛋仔派对远航蛋、主唱耀星_Eggy、UNI-航行的灯塔、TP-RLX-LIGHT 等，喜欢数码和技术，C / C++ / C# / Python / HTML / CSS / JavaScript 都懂一点。

这个站点不发布博文，主要提供工具与资源导航；想说的话基本都写在[网站](https://coldfieldobserver.github.io)里了。

## 部署方式

本网站部署于 **GitHub Pages**，通过静态托管对外提供服务。推送到 `master` 后由 `.github/workflows/deploy.yml` 自动执行 `pnpm build` → 上传 `.output/public` → 部署 Pages。站点没有后端，所有内容以静态资源形式存在，更新时需重新构建并推送。

## 许可证

本项目采用 **MIT** 许可证，详见 [LICENSE](LICENSE)。
