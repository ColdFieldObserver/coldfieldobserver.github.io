<script setup lang="ts">
import { computed } from 'vue';
import { withBase } from 'vitepress';
import { SITE } from '@/config';
import {
  activeMobileDrawer,
  closeMobileDrawer,
  toggleMobileDrawer,
  useMobileDrawerGestures,
} from '@/composables/useMobileDrawer';

const leftOpen = computed(() => activeMobileDrawer.value === 'left');
const rightOpen = computed(() => activeMobileDrawer.value === 'right');
useMobileDrawerGestures();
</script>

<template>
  <!-- 阅读模式排除：顶部为全站页眉，声明 role="banner" 让提取器按 chrome 剔除 -->
  <header class="site-header" role="banner" data-nosnippet>
    <a class="brand" :href="withBase('/')" :aria-label="SITE.brand">
      <span class="brand-mark" aria-hidden="true">⬢</span>
      <span class="brand-text">{{ SITE.brand }}</span>
      <span class="brand-sub">{{ SITE.codename }}</span>
    </a>

    <div class="header-right">
      <button
        class="drawer-btn"
        type="button"
        :aria-label="leftOpen ? '关闭主导航' : '打开主导航'"
        :aria-expanded="leftOpen"
        @click="toggleMobileDrawer('left')"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      <button
        class="drawer-btn"
        type="button"
        :aria-label="rightOpen ? '关闭侧边栏' : '打开侧边栏'"
        :aria-expanded="rightOpen"
        aria-controls="sidebar-right"
        @click="toggleMobileDrawer('right')"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <line x1="15" y1="4" x2="15" y2="20" />
          <line x1="18" y1="8" x2="18" y2="8" />
          <line x1="18" y1="12" x2="18" y2="12" />
          <line x1="18" y1="16" x2="18" y2="16" />
        </svg>
      </button>

    </div>
  </header>

  <!--
    遮罩层必须渲染在 <header> 之外。
    header 自身 z-index:120 会创建层叠上下文，如果把遮罩放在 header 内，
    遮罩会被强制绘制在 z-index:100 的侧栏抽屉之上，导致抽屉不可点击。
    提到 header 之后即回到根层叠上下文，z-index:99 位于抽屉(100)之下、header(120)之上。
  -->
  <div
    class="sidebar-overlay"
    :class="{ open: activeMobileDrawer !== null }"
    aria-hidden="true"
    @click="closeMobileDrawer"
  />
</template>
