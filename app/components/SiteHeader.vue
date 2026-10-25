<script setup lang="ts">
import { computed } from 'vue';
import { SITE } from '#shared/site';
import {
  activeMobileDrawer,
  closeMobileDrawer,
  toggleMobileDrawer,
  useMobileDrawerGestures,
} from '~/composables/useMobileDrawer';

const leftOpen = computed(() => activeMobileDrawer.value === 'left');
const rightOpen = computed(() => activeMobileDrawer.value === 'right');
useMobileDrawerGestures();
</script>

<template>
  <!-- 阅读模式排除：顶部为全站页眉，role="banner" 让提取器按 chrome 剔除 -->
  <header
    class="site-header flex items-center justify-between gap-4 bg-sidebar px-[22px]"
    role="banner"
    data-nosnippet
  >
    <NuxtLink class="flex min-w-0 items-center gap-2.5" to="/" :aria-label="SITE.brand">
      <img
        class="size-[30px] flex-none rounded-xs border border-edge/60 object-cover"
        src="/images/logo.webp"
        alt=""
        width="30"
        height="30"
        aria-hidden="true"
      />
      <span class="brand-text text-[17px] font-bold tracking-[2px] whitespace-nowrap">{{ SITE.brand }}</span>
      <span class="brand-sub hidden">{{ SITE.codename }}</span>
    </NuxtLink>

    <div class="flex items-center gap-3">
      <button
        class="drawer-btn mecha-clip-s border border-edge bg-accent-soft text-accent-2 hover:bg-accent hover:text-on-accent"
        type="button"
        :aria-label="leftOpen ? '关闭主导航' : '打开主导航'"
        :aria-expanded="leftOpen"
        @click="toggleMobileDrawer('left')"
      >
        <Icon name="i-lucide-menu" class="size-5" aria-hidden="true" />
      </button>

      <button
        class="drawer-btn mecha-clip-s border border-edge bg-accent-soft text-accent-2 hover:bg-accent hover:text-on-accent"
        type="button"
        :aria-label="rightOpen ? '关闭侧边栏' : '打开侧边栏'"
        :aria-expanded="rightOpen"
        aria-controls="sidebar-right"
        @click="toggleMobileDrawer('right')"
      >
        <Icon name="i-lucide-panel-right" class="size-5" aria-hidden="true" />
      </button>
    </div>
  </header>

  <!--
    遮罩必须渲染在 <header> 之外：header 自身 z-index:120 会创建层叠上下文，
    放在里面会被抬到抽屉(100)之上，导致抽屉不可点击。
  -->
  <div
    class="sidebar-overlay"
    :class="{ open: activeMobileDrawer !== null }"
    aria-hidden="true"
    @click="closeMobileDrawer"
  />
</template>
