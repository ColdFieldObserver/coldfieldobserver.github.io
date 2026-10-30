# Copilot Instructions

> 本文件仅适用于 **coldfieldobserver.github.io**（冷域观者的个人网站），请勿套用到同作者的其他仓库。

## 项目指南

### 交互与视觉（硬性规则）
- 视觉语言是**机甲蓝**：方正切角（`mecha-clip-*`）、细描边、外发光、等宽字体小标签。新增组件先想「有没有现成的机甲件可用」，不要引入圆润的通用 SaaS 风格。
- **不要引入全屏加载动画**（原 `MechaLoade`/`MechaLoade.vue` 一类首屏遮罩已移除）：首屏只保留 `PageProgress` 这条细进度条，任何「等 JS 初始化完再显示页面」的实现都会被回退。
- 搜索弹窗用原生 `<dialog>` + `showModal()`（焦点陷阱 / ESC / 滚动锁由浏览器负责），关闭后要清空关键词并把焦点还给触发元素。
- 新增动效必须遵循系统「减少动态效果」偏好，补 `@media (prefers-reduced-motion: reduce)` 分支。
- 悬浮反馈只用掉颜色、描边、外发光与封面轻微 `scale`；**不要**做位移、旋转一类夸张效果（长列表里会抖）。

### 一致性
- 文章列表（新闻 / 分类 / 标签 / 搜索）**必须复用同一套卡片机制**：`PostCard` + `CardGrid` + `Pagination` + `usePagedPosts`。归档页例外（按年分页 + 按月分组）。
- 左右移动端抽屉共用 `useMobileDrawer.ts` 的同一份模块级状态与手势实现，不要为某一侧写特例。
- 站点内容的「作者信息 / 友情链接 / 公告」集中在 `app/data/rightSidebarContent.ts`，侧栏与「关于」页都读这一份，不要各写一份。

## 项目概况

| 项 | 值 |
| --- | --- |
| 定位 | 个人站点，纯静态（SSG），部署于 GitHub Pages |
| 线上地址 | https://coldfieldobserver.github.io（`app.baseURL = '/'`，URL 不带 `.html` 与尾斜杠） |
| 技术栈 | Nuxt `4.6.2`（Vite + Nitro 预渲染）+ Vue 3 + TypeScript `~7.0.2` + Tailwind CSS `4.3.3` + @nuxt/content `3.16` + @nuxt/icon |
| 包管理器 | pnpm 12（依赖构建设置在 `pnpm-workspace.yaml` 的 `allowBuilds`） |
| 发布流程 | 推送到 `master` → `.github/workflows/deploy.yml` 构建并部署 `.output/public` |
| 许可证 | MIT |

> 本站**没有**引入 Nuxt UI / Preflight / 任何统计脚本。需要组件时自己写，样式一律原生 CSS + Tailwind 工具类。

## 常用命令

```bash
pnpm dev                       # 本地开发（默认 http://localhost:3000）
pnpm build                     # 生产构建 = nuxt generate，产物在 .output/public
pnpm exec nuxt prepare         # 生成 .nuxt 类型与别名（改 nuxt.config 后跑一次）
```

- **构建必须零错误零警告**：`nitro.prerender.failOnError: true`，任何预渲染路由 404 都会让构建失败。
- `nuxt generate` 只产出 `.output/public`（没有 server 产物），因此 `pnpm preview` 不可用；本地验收静态站点请用支持「无扩展名 → `.html` 回退」的静态服务器。
- 项目没有测试，验收方式：`pnpm build` 通过 + 浏览器实看。

## 目录结构

```
app/
├─ app.vue                        # 全局 titleTemplate（withSiteSuffix）
├─ app.config.ts                  # @nuxt/icon 的 svg 模式（唯一一处 app.config）
├─ error.vue                      # 404 页（保留站点外壳）
├─ router.options.ts              # 禁止 window 滚动，改滚 .site-main
├─ layouts/default.vue            # 壳层：进度条 + 顶栏 + 左右栏 + 主滚动区 + 搜索弹窗
├─ pages/                         # 路由即布局（见下）
├─ components/                    # 扁平注册（pathPrefix: false），文件名即标签名
│  └─ content/ProsePre.vue        # 代码块信息栏（语言 + 复制）
├─ composables/                   # usePosts / useTheme / useSearch / useMobileDrawer / usePostEnhance …
├─ data/rightSidebarContent.ts    # 个人档案 / 友情链接 / 公告（唯一数据源）
├─ plugins/                       # posts（预取文章）、shortcuts.client（搜索快捷键）
├─ utils/base-url.ts              # withBase 垫片
└─ assets/styles/                 # main.css / tokens.css / base.css / layout.css / shell.css / prose.css / animation.css
content/posts/*.md                # 文章（唯一内容源）
public/                           # 图片、favicon、giscus 主题（light.css / dark.css）
server/routes/                    # atom.xml、rss.xml、api/posts.json、api/search.json
shared/                           # site.ts（SITE / TOOL_LINKS / PAGE_SIZE / GISCUS）、types/、utils/
build/post-index.ts               # 构建期 fs 枚举：prerender 路由全集
content.config.ts / nuxt.config.ts
```

不要提交 `.nuxt/`、`.output/`、`.data/`、`debug.log` 等产物与日志（已在 `.gitignore`）。

## 路由与页面机制

- **路由 = 文件**，没有 `frontmatter.layout` 分派。页面壳只做三件事：取数据、写 `useHead` 标题、`throw createError` 校验参数。
- 路由表：

| URL | 文件 |
| --- | --- |
| `/`、`/about`、`/search/` | `pages/index.vue`、`about.vue`、`search.vue` |
| `/posts/`、`/posts/page/:n`、`/posts/:slug` | `pages/posts/index.vue`、`posts/page/[page].vue`、`posts/[slug].vue` |
| `/archives/`、`/archives/page/:n` | `pages/archives/**`（第 n 页 = 第 n 个年份） |
| `/categories/`、`/categories/:name(/page/:n)` | `pages/categories/**` |
| `/tags/`、`/tags/:tag(/page/:n)` | `pages/tags/**` |
| `/tools/`、`/tools/:slug` | `pages/tools/**`（5 个纯前端工具，单页分派） |

- 站内链接一律用 `<NuxtLink :to>`；**严禁裸 `<a href>` 指向站内路由**（Nuxt 不拦截，会退化成整页刷新，页面过渡与进度条全失效）。
- 拼链接用 `withBase()`（`app/utils/base-url.ts`）或 `shared/utils/term.ts` 的 `termPath` / `termPagePrefix`；**模板里不能直接调 `withBase`**（会变成 `_ctx.withBase is not a function`），要在 setup 里先取成变量。
- **预渲染路由必须显式登记**：`build/post-index.ts` 的 `buildRoutes()` 由 `nuxt.config.ts` 的 `hooks['prerender:routes']` 注入。新增一类页面时要同步，否则产物里没有该页。
- 中文 term 传给 `prerender:routes` 用原始 UTF-8（`/categories/公告`），不要预先编码，否则产物文件名会变成 `%E5%85%AC...`。
- `nitro.prerender.autoSubfolderIndex: false`：`/about` 落成 `about.html`，URL 不带尾斜杠（Giscus 的 `pathname` 映射依赖这一点，别改）。

## 内容与数据

- 文章 frontmatter：`title`、`date`（`YYYY-MM-DD HH:mm:ss`）、`categories`、`tags`、`description`、`stickypost`（仅 `true` 置顶）、`cover`。字段类型在 `content.config.ts` 用 zod 声明，**新增字段先改 schema**。
- `date` 由 YAML 1.2 解析成字符串，**必须**经 `shared/utils/date.ts` 的 `parsePostDate()` 按 UTC 解释，否则构建机时区不同会导致日期漂移。
- 数据链路：`server/routes/api/posts.json.ts`（轻量列表）与 `api/search.json`（检索语料）在构建期查询内容库、预渲染成静态 JSON；前端由 `plugins/posts.ts` 预取进 `useState('posts:all')`，组件通过 `useAllPosts()` 读取。**不要在普通组件里直接调 `queryCollection`**；只有页面在 `<Suspense>` 内（如 `posts/[slug].vue`）才用 `useAsyncData` + `queryCollection`。
- 列表分页统一 `usePagedPosts(getCurrent, getSource)`；`PAGE_SIZE`（9）在 `shared/site.ts`，构建期枚举与前端共用同一常量。
- 站点信息、工具清单、Giscus 配置在 `shared/site.ts`；个人档案 / 友情链接 / 公告在 `app/data/rightSidebarContent.ts`。
- 文章内增强由 `usePostEnhance.ts` 在客户端完成：目录填充、页内锚点接管（`preventDefault` + `replaceState`，避免「默认跳转 + 手动对齐 + hashchange」三重滚动）。**Mermaid 已移除**，图表请用图片或外链，不要再从 CDN 拉 mermaid。

## 样式约定

- 全局样式在 `app/assets/styles/`：`main.css`（入口）→ `tokens.css`（`@theme` 令牌）→ `base.css`（真值变量 + reset + 机甲小组件）→ `layout.css` / `shell.css` / `prose.css` / `animation.css`。页面与组件样式写在各自 `.vue` 的 `<style scoped>`，**一律原生 CSS + Tailwind 工具类**，无预处理器。
- `main.css` 四条铁律：`@import` 全部置顶；Tailwind 的 `theme` / `utilities` 排在项目文件之前；**不引入 Preflight**（保留 `base.css` 自己的重置）；`@theme` / `@custom-variant` 只写在 `tokens.css`。
- 项目文件的 CSS **故意不进 `@layer`**（`prose.css` 是唯一例外，整块在 `@layer components`）：未分层规则优先级高于 utilities，所以语义类会压住工具类——加工具类时要同时删掉被取代的声明。
- `base.css` 的全局 reset **必须留在 `@layer base`**：未分层的 `* { margin: 0 }` 会让 `p-*` / `mt-*` 全部失效。
- `tokens.css` 用 `@theme static`。注意三处「清空命名空间」的连带后果，新增色 / 圆角时必须补齐：
  - `--color-*: initial` 后只留 `transparent` / `white` / `black` 与站点语义色（`accent` / `ink` / `bg` / `panel` / `card` / `line` / `edge` / `code-*`）；
  - `--radius-*: initial` 后要补 `xs…3xl`，否则 `rounded-md` 整条规则消失（另有 `--radius-s/m/l` = 2/3/4px 的项目刻度）；
  - `--breakpoint-*: initial` 后要补 `sm…2xl`，否则依赖它们的规则静默消失。
- 颜色真值只写在 `base.css` 的 `:root`，深色写两份（`[data-theme='dark']` 与 `prefers-color-scheme`），**两份必须逐字一致**。
- 媒体查询**手写** `@media (max-width: Npx)`，不用 `sm:` / `md:` 变体：`1024px` 必须与 `useMobileDrawer` 的 `matchMedia('(max-width: 1024px)')` 完全一致。
- `body { overflow: hidden }`，**全站唯一纵向滚动容器是 `.site-main`**。路由滚动由 `app/router.options.ts` 接管；页内锚点由 `usePostEnhance` 接管。
- 装饰件用 `@utility mecha-clip-{s,m,l,dual}` 表达切角；`--ease-out-soft` / `--ease-inout` 是全站唯一两条缓动曲线。
- 注释风格：中文、`/* ==== */` 分节横幅，只解释「为什么」，不复述代码。

## Markdown 渲染（@nuxt/content）

- `app/components/content/ProsePre.vue` 定义了代码块的 DOM 契约，`prose.css` 的排版依赖它：
  `div.code-block.language-* > .code-head(span.lang + button.copy) + pre.shiki`。
  语言标签在信息栏内（不是角标），信息栏 `position: sticky`；复制逻辑靠 `button.copy` 定位，**这个类名不能改**。
  无语言（` ``` `）的代码块不加信息栏。
- Shiki 双主题必须配成 `highlight.theme = { default, dark }`（产物里是 `--shiki-light` / `--shiki-dark`）。
- 目录不是构建期占位：`posts/[slug].vue` 在正文有两级标题时渲染 `[data-post-toc]`，`usePostEnhance` 的 `fillToc()` 再往里面填。
- 数学公式走 `remark-math` + `rehype-katex`（构建期出 HTML + MathML），样式在 `prose.css` 的 `.katex*` 段。
- 正文不允许内联裸 HTML（MDC 会丢弃）；需要结构化块时用 Vue 组件或 MDC 语法。

## 字体与图标

- 字体走 CDN（`nuxt.config.ts` 的 `app.head`），**仓库不保留字体文件**：
  - HarmonyOS Sans SC（`harmonyos-sans-sc-webfont-splitted@1.1.0` 的 `Regular` / `Medium` / `Bold` 三个 unicode-range 分片）—— 正文与 UI；
  - Cascadia Code（`@fontsource/cascadia-code@5.2.3`）—— 代码块等宽。
  回退链定义在 `base.css` 的 `--font-ui` / `--font-code`。
- 图标统一 `<Icon name="i-lucide-xxx" />`（品牌图标 `i-simple-icons-xxx`），没有 Nuxt UI。
- **新增动态 `:name` 图标必须同步 `nuxt.config.ts` 的 `icon.clientBundle.icons`**（19 项）：`scan` 只认模板里的字面量，动态绑定的不登记会退化成运行时取图。
- `app.config.ts` 的 `icon.mode: 'svg'` 保证构建期内联 `<svg>`，**别改成 `css`**（css 模式输出空 `<span class="iconify">`，首屏没图标）。
- 网站 Logo 是图片（`public/images/logo.webp`），不属于图标体系。

## 移动端与抽屉

- 断点：`≤1024px` 进入抽屉模式；左右侧栏共用 `useMobileDrawer.ts` 的模块级状态（`activeMobileDrawer` / `drawerProgress`）。
- 抽屉靠 `transform` + `visibility` 常驻过渡（`display` 无法过渡），拖拽中加 `is-dragging` 取消过渡；遮罩透明度与模糊由 `--drawer-progress` 驱动，跟手渐显而不是松手才出现。
- 手势：屏幕左右边缘内滑、抽屉内反向拖拽关闭、位移或速度阈值、滚动锁定、`Esc` 关闭、路由切换与跨断点自动关闭——改手势时保持这些行为。

## 无障碍与降级

- 图标一律 `aria-hidden="true"` 并配文字或 `aria-label`；可切换按钮补 `aria-expanded` / `aria-controls` / `aria-current`。
- 主内容使用 `<main id="content" role="main">`；`<html class="js">` 只在 JS 可用时由 head 内联脚本添加，`html:not(.js)` 的降级样式必须保持可用。
- 无 JS 降级规则统一写在 `base.css` 末尾的「无 JavaScript 降级」段，**不要写进组件的 `<style scoped>`**（Vue scoped 会把 `:global(html:not(.js)) .foo` 收窄错）。
- 不要在模板里用 `<noscript>` 做降级（会造成 hydration mismatch），统一走 `html:not(.js)` + CSS。

## 配置与类型（易踩坑）

- `tsconfig.json` 只 `extends ./.nuxt/tsconfig.json`；别名：`~` / `@` → `app/`，`~~` → 仓库根，`#shared` → `shared/`，`#server` → `server/`。
- 改了影响类型 / 别名的 `nuxt.config.ts` 后跑一次 `pnpm exec nuxt prepare`。
- `@nuxt/content` 需要 `better-sqlite3` 原生绑定：已在 `pnpm-workspace.yaml` 的 `allowBuilds` 放行，**不要在 CI 上加 `--ignore-scripts`**。
- 服务端路由里查询内容库必须 `queryCollection(event, 'posts')`（带 event）；JSON 路由用 `api/xxx.json.ts`，不要写 `[slug].json.ts`（Nitro 会把后缀并进参数）。
- `:to="/"` 是非法绑定（会被当成正则），写 `to="/"`。
- 主题三态由 `<html data-theme="auto|light|dark">` 驱动（本站只写 `data-theme`，没有 `.dark` 双写）；`localStorage` key 为 `cfo-theme`，改 key 必须同步 `nuxt.config.ts` head 的首帧脚本。

## Git 与协作

- **不要直接向 `master` 推送**：改动走「分支 + PR」，`master` 只接受合并（部署 workflow 由 `master` 触发）。
- 分支命名 `feat/<简述>` / `fix/<简述>` / `refactor/<简述>`；同一主题的多次提交留在同一分支。
- **每个提交都要能独立 `pnpm build` 通过**；改版按「可回滚单元」拆（换组件 → 调样式 → 补文档），便于单独 revert。
- 提交信息用中文，`feat:` / `fix:` / `style:` / `chore:` / `docs:` 前缀；正文写「为什么、影响面」，不复述 diff。中文信息写入 UTF-8（无 BOM）文件后 `git commit -F`。
- 不要提交产物与临时文件；不要为本地调试临时改 `PAGE_SIZE`、`failOnError` 后忘记还原。
- 依赖变更必须同时提交 `pnpm-lock.yaml`；新增需要构建脚本的依赖要在 `pnpm-workspace.yaml` 的 `allowBuilds` 放行。
- 视觉改动请附截图：浅色 + 深色、桌面 + ≤1024px 各一组。
- 不要对已推送的分支 `rebase` / `force-push`；同步用 merge。

## 提交前自检清单

1. `pnpm build` 通过且零警告（`failOnError: true`，任何预渲染 404 都会失败）。
2. `find .output/public -name "*.html"` 与预期路由一致；中文分类 / 标签文件名未被百分号编码。
3. 浏览器实看：`/`、`/posts/`、`/archives/`、`/categories/`、`/tags/`、`/search/`、`/tools/`、一篇 `/posts/<slug>`。
4. 桌面与 ≤1024px 各过一遍：左右抽屉开合与拖拽、搜索弹窗（`Ctrl / ⌘ + K` 与 `/`）、主题三态切换。
5. 站内跳转不整页刷新（Network 里不应出现 document 请求）。
6. 新增图标已登记进 `icon.clientBundle.icons`；新增颜色 / 圆角 / 断点来自变量；新增动效有 reduced-motion 分支。
7. 没有提交构建产物、缓存或临时文件。
