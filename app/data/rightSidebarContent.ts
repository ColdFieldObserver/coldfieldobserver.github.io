/**
 * 右侧边栏内容数据：个人档案、友情链接、公告。
 * 纯数据模块，不引入任何运行时依赖，便于单独维护。
 */

/** 个人档案 */
export const PERSONAL_PROFILE: string[] = [
    '兴趣爱好：打游戏、听音乐、看视频、户外散步、偶尔写点东西',
    '喜欢玩的游戏：逃跑吧少年、蛋仔派对、我的世界、植物大战僵尸2、保卫萝卜4、光遇',
    '主阵地：逃少音乐档案馆（B站 & WP 独立站）',
];

/** 友情链接条目 */
export interface FriendLink {
    /** 链接名 */
    name: string;
    /** 链接 URL */
    url: string;
    /** 链接图标 Iconify 类名 */
    icon: string;
}

/** 友情链接列表（顺序即侧边栏展示顺序） */
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

/** 公告条目 */
export interface Announcement {
    /** 公告日期 */
    date: string;
    content: string;
}

/** 公告列表 */
export const ANNOUNCEMENTS: Announcement[] = [
    {
        date: '2026-05-03',
        content: '个人博客迎来重大更新。'
    },
    {
        date: '2026-05-13',
        content: '更换B站账号。'
    },
];
