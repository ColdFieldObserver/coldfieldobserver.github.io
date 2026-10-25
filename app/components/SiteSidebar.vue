<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, watch } from 'vue';
import { useAllPosts } from '~/composables/usePosts';
import { activeMobileDrawer } from '~/composables/useMobileDrawer';

// 左侧固定导航栏：分区导航 + 日志索引 + 系统状态 + 主题开关
const route = useRoute();
const allPosts = useAllPosts();
const totalPosts = computed(() => allPosts.value.length);

const NAV_MAIN = [
  { key: 'home', label: '首页', to: '/', icon: 'i-lucide-house' },
  { key: 'blog', label: '博客', to: '/posts/', icon: 'i-lucide-newspaper' },
  { key: 'tools', label: '工具', to: '/tools/', icon: 'i-lucide-wrench' },
  { key: 'about', label: '关于', to: '/about', icon: 'i-lucide-info' },
] as const;

const NAV_BLOG = [
  { label: '归档', to: '/archives/' },
  { label: '分类', to: '/categories/' },
  { label: '标签', to: '/tags/' },
  { label: 'RSS 订阅', href: '/atom.xml', external: true },
] as const;

/** 当前路径归属的导航分区 */
const activeKey = computed(() => {
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
/** 订阅源地址（补 baseURL） */
const atomHref = withBase('/atom.xml');
let mobileBreakpoint: MediaQueryList | undefined;

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape' && activeMobileDrawer.value) activeMobileDrawer.value = null;
}

function onBreakpointChange(event: MediaQueryListEvent): void {
  if (!event.matches) activeMobileDrawer.value = null;
}

watch(
  () => route.fullPath,
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
  <aside
    class="sidebar-left"
    :class="{ open: navOpen }"
    role="navigation"
    aria-label="主导航"
    data-nosnippet
  >
    <div class="panel-rule mecha-clip-m relative border border-line bg-panel p-3.5">
      <div
        class="mb-3 flex items-center gap-2 border-b border-line pb-2 text-[11.5px] font-bold tracking-[2px] text-accent-2 uppercase before:size-1.5 before:rotate-45 before:bg-accent before:content-['']"
      >
        装甲导航
      </div>
      <nav class="flex flex-col gap-1" aria-label="站点导航">
        <NuxtLink
          v-for="item in NAV_MAIN"
          :key="item.key"
          class="flex items-center gap-2.5 border-l-[3px] px-2.5 py-[9px] text-[14.5px] text-ink-2 transition-colors"
          :class="
            activeKey === item.key
              ? 'border-l-accent bg-accent-soft font-semibold text-ink'
              : 'border-transparent hover:border-l-edge hover:bg-accent-soft hover:text-ink'
          "
          :to="item.to"
          :aria-current="activeKey === item.key ? 'page' : undefined"
        >
          <Icon
            :name="item.icon"
            class="size-[18px] transition-colors"
            :class="activeKey === item.key ? 'text-accent' : 'text-ink-3'"
          />
          <span>{{ item.label }}</span>
        </NuxtLink>
      </nav>
    </div>

    <div class="panel-rule mecha-clip-m relative border border-line bg-panel p-3.5">
      <div
        class="mb-3 flex items-center gap-2 border-b border-line pb-2 text-[11.5px] font-bold tracking-[2px] text-accent-2 uppercase before:size-1.5 before:rotate-45 before:bg-accent before:content-['']"
      >
        日志索引
      </div>
      <nav class="flex flex-col gap-1" aria-label="博客分区">
        <template v-for="item in NAV_BLOG" :key="item.label">
          <a
            v-if="item.external"
            class="flex items-center gap-2.5 border-l-[3px] border-transparent px-2.5 py-1.5 text-[13.5px] text-ink-2 transition-colors hover:border-l-edge hover:bg-accent-soft hover:text-ink"
            :href="atomHref"
            target="_blank"
            rel="alternate noopener"
          >
            <Icon name="i-lucide-chevron-right" class="size-3.5 text-ink-3" />
            <span>{{ item.label }}</span>
          </a>
          <NuxtLink
            v-else
            class="flex items-center gap-2.5 border-l-[3px] border-transparent px-2.5 py-1.5 text-[13.5px] text-ink-2 transition-colors hover:border-l-edge hover:bg-accent-soft hover:text-ink"
            :to="item.to"
          >
            <Icon name="i-lucide-chevron-right" class="size-3.5 text-ink-3" />
            <span>{{ item.label }}</span>
          </NuxtLink>
        </template>
      </nav>
    </div>

    <div class="mecha-clip-m relative border border-line bg-panel p-3.5">
      <div
        class="mb-3 flex items-center gap-2 border-b border-line pb-2 text-[11.5px] font-bold tracking-[2px] text-accent-2 uppercase before:size-1.5 before:rotate-45 before:bg-accent before:content-['']"
      >
        系统状态
      </div>
      <div class="flex items-center justify-between gap-2 py-1 font-mono text-xs text-ink-2">
        <span>日志总数</span><b class="font-semibold text-accent-2">{{ totalPosts }}</b>
      </div>
      <div class="flex items-center justify-between gap-2 py-1 font-mono text-xs text-ink-2">
        <span>工具模块</span><b class="font-semibold text-accent-2">5</b>
      </div>
      <div class="flex items-center justify-between gap-2 py-1 font-mono text-xs text-ink-2">
        <span>核心状态</span><b class="font-semibold text-accent-2">ONLINE</b>
      </div>
      <div class="mt-1.5 h-1 overflow-hidden bg-line">
        <i class="block h-full w-[92%] bg-accent [background-image:var(--accent-grad)]" />
      </div>
    </div>

    <ThemeToggle />
  </aside>
</template>
