<script setup lang="ts">
import { computed } from 'vue';
import { SITE, TOOL_LINKS } from '#shared/site';
import { latestPosts, useAllPosts } from '~/composables/usePosts';

const all = useAllPosts();
const posts = computed(() => latestPosts(all.value, 3));

const MODULES = [
  { to: '/posts/', title: '博客日志', desc: '站点更新、技术笔记与折腾记录。', icon: 'i-lucide-newspaper' },
  { to: '/tools/', title: '在线工具', desc: 'Base64 / Unicode / 时间戳 / URL 等小工具。', icon: 'i-lucide-wrench' },
  { to: '/about', title: '关于本站', desc: '站点说明、版权与开源协议。', icon: 'i-lucide-info' },
] as const;

useHead({ title: '首页' });
</script>

<template>
  <div class="mx-auto max-w-page">
    <!-- 驾驶舱 Hero -->
    <section
      class="mecha-clip-l relative mb-8 overflow-hidden border border-line bg-panel px-7 py-9"
    >
      <p class="font-mono text-[11.5px] tracking-[2px] text-accent-2">{{ SITE.codename }}</p>
      <h1 class="mt-3 text-[clamp(28px,5vw,42px)] leading-[1.2] font-extrabold tracking-[2px] text-ink">
        {{ SITE.brand }}
      </h1>
      <p class="mt-3 max-w-[62ch] text-[14.5px] leading-[1.8] text-ink-2">
        个人网站 · 机甲重构版：博客日志、在线工具与资源导航，支持 RSS 订阅与全站检索。
      </p>
      <div class="mt-6 flex flex-wrap gap-3">
        <NuxtLink class="mecha-clip-s border border-accent bg-accent px-5 py-2 text-[14px] font-semibold text-on-accent transition-[filter] hover:brightness-110" to="/posts/">
          进入博客
        </NuxtLink>
        <NuxtLink class="mecha-btn" to="/tools/">打开工具箱</NuxtLink>
      </div>
    </section>

    <!-- 模块入口 -->
    <section class="mb-8">
      <h2 class="mecha-title mb-4">站点模块</h2>
      <div class="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4">
        <NuxtLink
          v-for="item in MODULES"
          :key="item.to"
          class="group mecha-clip-s flex items-start gap-3 border border-line bg-card px-4 py-4 transition-colors hover:border-edge hover:bg-accent-soft"
          :to="item.to"
        >
          <Icon :name="item.icon" class="mt-0.5 size-4 shrink-0 text-accent-2" />
          <span>
            <span class="block text-[15px] font-semibold text-ink">{{ item.title }}</span>
            <span class="mt-1 block text-[13px] leading-[1.6] text-ink-3">{{ item.desc }}</span>
          </span>
        </NuxtLink>
      </div>
    </section>

    <!-- 最新日志 -->
    <section class="mb-8">
      <div class="mb-4 flex items-baseline justify-between">
        <h2 class="mecha-title">最新日志</h2>
        <NuxtLink class="font-mono text-[12.5px] text-accent-2 hover:underline" to="/posts/">
          查看全部 →
        </NuxtLink>
      </div>
      <CardGrid :posts="posts" empty-text="还没有日志" />
    </section>

    <!-- 工具 + 蛋仔 ID -->
    <section class="grid gap-4 md:grid-cols-2">
      <div class="mecha-clip-s border border-line bg-card p-5">
        <h2 class="mb-3 text-[15px] font-semibold text-ink">常用工具</h2>
        <ul class="flex flex-col gap-2">
          <li v-for="tool in TOOL_LINKS" :key="tool.slug">
            <NuxtLink
              class="flex items-center justify-between gap-3 border-b border-dashed border-line pb-2 text-[13.5px] text-ink-2 transition-colors hover:text-accent-2"
              :to="`/tools/${tool.slug}`"
            >
              <span>{{ tool.name }}</span>
              <Icon name="i-lucide-arrow-right" class="size-3.5" />
            </NuxtLink>
          </li>
        </ul>
      </div>

      <div class="mecha-clip-s border border-line bg-card p-5">
        <h2 class="mb-3 text-[15px] font-semibold text-ink">蛋仔派对 ID</h2>
        <div class="flex flex-wrap gap-4">
          <img src="/images/eggypartyid.jpg" alt="蛋仔派对 ID" class="w-40 border border-line" loading="lazy" />
          <img src="/images/eggypartyid2.jpg" alt="蛋仔派对 ID（备用）" class="w-40 border border-line" loading="lazy" />
        </div>
      </div>
    </section>
  </div>
</template>
