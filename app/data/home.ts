/**
 * 首页数据：Hero 文案、我的项目、游戏 ID、站点说明。
 * 纯数据模块，不引入任何运行时依赖。
 */

/** Hero 头像：纯几何占位图（SVG），后续换图只改这一个路径 */
export const AVATAR = '/images/avatar.svg';

/** Hero 简介：整段由一个字符串维护，避免模板里散落多段文本 */
export const HERO_INTRO =
  '简单介绍一下我自己吧。我是冷域观者，一个逃跑吧少年和蛋仔派对玩家，偶尔也玩我的世界、PVZ2 和保卫萝卜4，这里是我的个人网站。';

/** 我的项目 */
export interface ProjectItem {
  name: string;
  description: string;
  /** Iconify 类名（动态绑定，需登记进 icon.clientBundle.icons） */
  icon: string;
  /** 主链接（外部站点） */
  to: string;
  /** 补充链接（可选） */
  extra?: { label: string; to: string };
}

export const PROJECTS: ProjectItem[] = [
  {
    name: 'PidanUI 官网',
    description:
      '《蛋仔派对》风格 Windows 桌面美化项目的官方网站，Nuxt 4 + Nuxt UI 构建，纯静态部署。',
    icon: 'i-lucide-monitor',
    to: 'https://pidanui.eggycore.top',
  },
  {
    name: '逃少音乐档案馆',
    description:
      '自 SS1 赛季起持续归档《逃跑吧！少年》的赛季 BGM，坚持内录而非拆包，规避版权风险。',
    icon: 'i-simple-icons-bilibili',
    to: 'https://space.bilibili.com/3632301571311734',
    extra: { label: 'WordPress 独立站', to: 'https://dmmdzzmusicarchive.wordpress.com/' },
  },
];

/** 游戏 ID 卡片（蛋仔派对） */
export interface GameIdItem {
  /** 展示用名称 */
  name: string;
  /** 备注（大号 / 小号） */
  note: string;
  /** 图片地址（CDN） */
  image: string;
}

export const GAME_IDS: GameIdItem[] = [
  { name: '实况主灯塔', note: '大号', image: 'https://img.remit.ee/i/Kqi2hJUbtHeH' },
  { name: '翌测', note: '小号', image: 'https://img.remit.ee/i/v7QTWcHyx1t0' },
];

/** 「关于这个站点」正文：按段落顺序渲染，struck 的段落加删除线 */
export interface NoteSegment {
  text: string;
  struck?: boolean;
}

export const SITE_NOTE: NoteSegment[] = [
  {
    text: '这个网站的框架是用 AI 搭的，我只负责内容填充。不过，说句实话，如果我不给复杂的提示词，AI 也生成不出来这种「风格缝合怪」的网站。',
  },
  {
    text: '另外，AI 总是喜欢把 HTML 代码和 CSS、JS 代码写一块，即使我特意说明分离也是如此。',
    struck: true,
  },
  { text: '最终思考权还是在人类手中。' },
];
