/**
 * 站点常量：站点信息、社交 / 友情链接、分页与评论配置。
 */

/** 站点主标题 */
export const SITE_NAME = '冷域观者';

export const SITE = {
  /** 品牌名 */
  brand: '冷域观者',
  /** 副标题（机甲代号） */
  codename: 'CFO / COLDFIELD OBSERVER',
  /** 作者 */
  author: 'ColdFieldObserver',
  /** 站点根地址（GitHub Pages 用户主页） */
  mainUrl: 'https://coldfieldobserver.github.io',
} as const;

/** 右侧栏「友情链接」——内容来自原站点右侧边栏 */
export const SOCIAL_LINKS = [
  { label: '逃少音乐档案馆（B站）', href: 'https://space.bilibili.com/3632301571311734', icon: 'bilibili' },
  { label: '逃少音乐档案馆（WP）', href: 'https://dmmdzzmusicarchive.wordpress.com/', icon: 'globe' },
  { label: '冷域观者的B站个人空间', href: 'https://space.bilibili.com/3706982592678629', icon: 'bilibili' },
  { label: '冷域观者的博客（上线了）', href: 'https://coldfieldobserver.mysxl.cn/', icon: 'globe' },
  { label: '冷域观者的博客（WordPress）', href: 'https://alonewalkman.wordpress.com/', icon: 'globe' },
  { label: '冷域观者的GitHub', href: 'https://github.com/ColdFieldObserver', icon: 'github' },
  { label: 'Alone Voyager的GitHub Pages', href: 'https://alonevoyager.github.io/', icon: 'globe' },
  { label: '蛋小蓝的博客（建设中）', href: 'https://danxiaolan.wordpress.com/', icon: 'globe' },
] as const;

/** 首页 / 工具页共用的工具清单 */
export const TOOL_LINKS = [
  { name: 'Base64 编解码', slug: 'base64', desc: '在文本与 Base64 之间双向转换，支持 UTF-8 中文。' },
  { name: 'Unicode 编解码', slug: 'unicode', desc: '文本与 \\uXXXX 码点序列互转，支持代理对。' },
  { name: '时间戳转换', slug: 'timestamp', desc: '秒 / 毫秒时间戳与本地时间、UTC 时间互转。' },
  { name: 'URL 编解码', slug: 'url', desc: 'encodeURI / encodeURIComponent 全套编码与解码。' },
  { name: '蛋仔派对地图文本处理', slug: 'eggyparty-map-text', desc: '把游戏内地图分享文本整理成标准分享文案。' },
] as const;

/** 文章列表每页显示数量 */
export const PAGE_SIZE = 9;

/**
 * Giscus 评论配置（用户提供）。
 * repo / repoId / category / categoryId 必须成对匹配，否则 giscus.app
 * 会报 "giscus is not installed on this repository"。
 */
export const GISCUS = {
  repo: 'ColdFieldObserver/coldfieldobserver.github.io',
  repoId: 'R_kgDOSspP7Q',
  category: 'Announcements',
  categoryId: 'DIC_kwDOSspP7c4DHfe3',
  mapping: 'pathname',
  strict: '0',
  reactionsEnabled: '1',
  emitMetadata: '0',
  inputPosition: 'top',
  lang: 'zh-CN',
  loading: 'lazy',
} as const;
