<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, watch } from 'vue';
import { useData, useRoute, withBase } from 'vitepress';
import { allPosts } from '@/composables/usePosts';
import { activeMobileDrawer } from '@/composables/useMobileDrawer';
import ThemeToggle from './ThemeToggle.vue';

// 左侧固定导航栏：分区导航 + 系统状态面板 + 主题开关
const route = useRoute();
const { page } = useData();
const totalPosts = allPosts.length;

const NAV_MAIN = [
  { key: 'home', label: '首页', href: '/', icon: 'home' },
  { key: 'blog', label: '博客', href: '/posts/', icon: 'blog' },
  { key: 'tools', label: '工具', href: '/tools/', icon: 'tools' },
  { key: 'about', label: '关于', href: '/about.html', icon: 'about' },
] as const;

// 博客分区的子导航
const NAV_BLOG = [
  { label: '归档', href: '/archives/' },
  { label: '分类', href: '/categories/' },
  { label: '标签', href: '/tags/' },
  { label: 'RSS 订阅', href: '/atom.xml', external: true },
] as const;

type NavKey = (typeof NAV_MAIN)[number]['key'];

/** 当前路径归属的导航分区 */
const activeKey = computed<NavKey | ''>(() => {
  const path = route.path;
  if (path === '/' || path.startsWith('/index')) return 'home';
  if (
    path.startsWith('/posts') ||
    path.startsWith('/categories') ||
    path.startsWith('/tags') ||
    path.startsWith('/archives') ||
    path.startsWith('/search')
  ) {
    return 'blog';
  }
  if (path.startsWith('/tools')) return 'tools';
  if (path.startsWith('/about')) return 'about';
  return '';
});

const navOpen = computed(() => activeMobileDrawer.value === 'left');
let mobileBreakpoint: MediaQueryList | undefined;

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && activeMobileDrawer.value) activeMobileDrawer.value = null;
}

function onBreakpointChange(event: MediaQueryListEvent) {
  if (!event.matches) activeMobileDrawer.value = null;
}

// 路由切换时关闭抽屉
watch(
  () => page.value.relativePath,
  () => {
    activeMobileDrawer.value = null;
  },
);

onMounted(() => {
  document.addEventListener('keydown', onKeydown);
  mobileBreakpoint = window.matchMedia('(max-width: 1024px)');
  mobileBreakpoint.addEventListener('change', onBreakpointChange);
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown);
  mobileBreakpoint?.removeEventListener('change', onBreakpointChange);
  activeMobileDrawer.value = null;
});
</script>

<template>
  <!--
    阅读模式排除：左栏是站点导航（页面外壳），显式声明 role="navigation"，
    让阅读模式把它当导航 chrome 剔除，不会与正文争夺内容判定。
  -->
  <aside
    class="sidebar-left"
    :class="{ open: navOpen }"
    role="navigation"
    aria-label="主导航"
    data-nosnippet
  >
    <div class="side-block">
      <div class="side-title">装甲导航</div>
      <nav class="nav" aria-label="站点导航">
        <a
          v-for="item in NAV_MAIN"
          :key="item.key"
          class="nav-item"
          :class="{ active: activeKey === item.key }"
          :href="withBase(item.href)"
          :aria-current="activeKey === item.key ? 'page' : undefined"
        >
          <svg v-if="item.icon === 'home'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <svg v-else-if="item.icon === 'blog'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0V9" />
            <line x1="10" y1="7" x2="18" y2="7" />
            <line x1="10" y1="11" x2="18" y2="11" />
            <line x1="10" y1="15" x2="14" y2="15" />
          </svg>
          <svg v-else-if="item.icon === 'tools'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14.7 6.3a4 4 0 0 0 5 5l-9.4 9.4a2.4 2.4 0 0 1-3.4-3.4z" />
            <circle cx="16.5" cy="7.5" r="1.2" />
            <path d="M3 21l4-4" />
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <span>{{ item.label }}</span>
        </a>
      </nav>
    </div>

    <div class="side-block" :class="{ 'is-active': activeKey === 'blog' }">
      <div class="side-title">日志索引</div>
      <nav class="nav" aria-label="博客分区">
        <a
          v-for="item in NAV_BLOG"
          :key="item.href"
          class="nav-item small"
          :href="withBase(item.href)"
          :target="item.external ? '_blank' : undefined"
          :rel="item.external ? 'alternate noopener' : undefined"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 6 15 12 9 18" />
          </svg>
          <span>{{ item.label }}</span>
        </a>
      </nav>
    </div>

    <div class="side-block plain">
      <div class="side-title">系统状态</div>
      <div class="sys-line"><span>日志总数</span><b>{{ totalPosts }}</b></div>
      <div class="sys-line"><span>工具模块</span><b>5</b></div>
      <div class="sys-line"><span>核心状态</span><b>ONLINE</b></div>
      <div class="sys-bar"><i style="width: 92%" /></div>
    </div>

    <ThemeToggle />
  </aside>
</template>

<style scoped lang="scss">
@use '../styles/variables' as *;

.nav-item.small {
  padding: 6px 10px;
  font-size: 13.5px;

  svg {
    width: 14px;
    height: 14px;
  }
}
</style>
