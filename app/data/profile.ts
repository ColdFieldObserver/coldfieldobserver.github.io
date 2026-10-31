/**
 * 个人档案数据：首页「关于我」「身份主线经历」、底栏「友情链接」共用。
 * 纯数据模块，不引入任何运行时依赖。
 *
 * 内容以 `D:/TestProject/冷域观者对话记忆.md` 为准，不要凭空补细节。
 */

/** 个人档案（首页「关于我」列表） */
export const PERSONAL_PROFILE: string[] = [
  '兴趣爱好：打游戏、听音乐、看视频、户外散步、偶尔写点东西',
  '喜欢玩的游戏：逃跑吧少年、蛋仔派对、我的世界、植物大战僵尸2、保卫萝卜4、光遇',
  '主阵地：逃少音乐档案馆（B站 & WP 独立站）',
];

/** 身份主线经历的单个节点 */
export interface TimelineEntry {
  /** 时间段或年份（展示用，允许非精确值） */
  period: string;
  /** 身份名 */
  title: string;
  /** 一句说明 */
  description: string;
}

/**
 * 身份主线：按时间顺序排列，最后一项是当前在用的身份。
 * 「浮动账号机制」——每个账号有固定或不固定的生命周期，到期静默注销。
 */
export const TIMELINE: TimelineEntry[] = [
  {
    period: '2018 — 2023.05',
    title: 'RlxFKHDOA',
    description: '最早的主账号，混迹音游圈，2023 年 5 月注销。',
  },
  {
    period: '2022.02 — 2026.01',
    title: 'AsyncObserver',
    description: 'B 站时期的主号，逃少音乐档案馆的起点，2026 年 1 月注销。',
  },
  {
    period: '2025.11 — 2026.05',
    title: '栖小光自媒',
    description: '因为搜不到重名而选定，账号按浮动机制到期注销。',
  },
  {
    period: '2026 · 约 50 天',
    title: '冷域观者',
    description: 'ColdFieldObserver，本站与 GitHub 使用的身份，缩写 CFObserver。',
  },
  {
    period: '其后',
    title: '冷域航者',
    description: '与「冷域」同源的过渡身份。',
  },
  {
    period: '2026.07',
    title: '魔盗蛋',
    description: '只存在了 16 天，按机制静默注销。',
  },
  {
    period: '至今',
    title: '翌测',
    description: '由 AI 生成并抢注的双字备用 ID；另有小号「静迁之痕」。',
  },
];

/** 友情链接条目 */
export interface FriendLink {
  name: string;
  url: string;
  /** 链接图标 Iconify 类名 */
  icon: string;
}

/** 友情链接（顺序即底栏展示顺序） */
export const FRIEND_LINKS: FriendLink[] = [
  {
    name: '逃少音乐档案馆（B站）',
    url: 'https://space.bilibili.com/3632301571311734',
    icon: 'i-simple-icons-bilibili',
  },
  {
    name: '逃少音乐档案馆（WP）',
    url: 'https://dmmdzzmusicarchive.wordpress.com/',
    icon: 'i-lucide-globe',
  },
  {
    name: '冷域观者的B站个人空间',
    url: 'https://space.bilibili.com/3706982592678629',
    icon: 'i-simple-icons-bilibili',
  },
  {
    name: '冷域观者的博客（上线了）',
    url: 'https://coldfieldobserver.mysxl.cn/',
    icon: 'i-lucide-globe',
  },
  {
    name: '冷域观者的博客（WordPress）',
    url: 'https://alonewalkman.wordpress.com/',
    icon: 'i-lucide-globe',
  },
  {
    name: '冷域观者的GitHub',
    url: 'https://github.com/ColdFieldObserver',
    icon: 'i-simple-icons-github',
  },
  {
    name: 'Alone Voyager的GitHub Pages',
    url: 'https://alonevoyager.github.io/',
    icon: 'i-lucide-globe',
  },
  {
    name: '蛋小蓝的博客（建设中）',
    url: 'https://danxiaolan.wordpress.com/',
    icon: 'i-lucide-globe',
  },
];

/** 社交账号（首页 Hero 的按钮 + 底栏） */
export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export const SOCIAL_LINKS: SocialLink[] = [
  {
    name: 'B站',
    url: 'https://space.bilibili.com/3706982592678629',
    icon: 'i-simple-icons-bilibili',
  },
  {
    name: 'GitHub',
    url: 'https://github.com/ColdFieldObserver',
    icon: 'i-simple-icons-github',
  },
];
