<script setup lang="ts">
import { computed } from 'vue';
import { SOCIAL_LINKS, TOOL_LINKS } from '#shared/site';
import { latestPosts, useAllPosts } from '~/composables/usePosts';
import { activeMobileDrawer } from '~/composables/useMobileDrawer';

// ============================================================
// 右侧部件栏：最新日志 / 个人档案 / 工具矩阵 / 友情链接 / 公告
// ============================================================
const allPosts = useAllPosts();
const posts = computed(() => latestPosts(allPosts.value, 5));
const drawerOpen = computed(() => activeMobileDrawer.value === 'right');

const NOTICE = [
  { date: '2026-05-13', text: '更换 B 站账号。' },
  { date: '2026-05-03', text: '个人博客迎来重大更新。' },
];

/** 小标题：左侧菱形 + 底部分隔线 */
const TITLE_CLASS =
  "mb-3 flex items-center gap-2 border-b border-line pb-2 text-[11.5px] font-bold tracking-[2px] text-accent-2 uppercase before:size-1.5 before:rotate-45 before:bg-accent before:content-['']";
const WIDGET_CLASS = 'mecha-clip-m relative border border-line bg-panel px-[15px] pt-[15px] pb-4';
const ITEM_CLASS =
  'block py-[6px] text-[13.8px] leading-[1.55] text-ink-2 transition-colors hover:text-accent-2 line-clamp-2';
</script>

<template>
  <!--
    阅读模式排除：本栏是辅助内容，显式 role="complementary" + data-nosnippet，
    避免被阅读模式并入正文。
  -->
  <aside
    id="sidebar-right"
    class="sidebar-right"
    :class="{ open: drawerOpen }"
    role="complementary"
    aria-label="侧边栏"
    data-nosnippet
  >
    <!-- 最新日志 -->
    <section :class="WIDGET_CLASS">
      <h2 :class="TITLE_CLASS">最新日志</h2>
      <div>
        <NuxtLink v-for="post in posts" :key="post.url" :class="ITEM_CLASS" :to="post.url">
          {{ post.title }}
        </NuxtLink>
        <p v-if="!posts.length" class="text-[13px] leading-[1.65] text-ink-3">暂无日志</p>
      </div>
      <NuxtLink
        class="mt-2.5 inline-block font-mono text-xs tracking-[0.5px] text-accent-2 hover:text-accent hover:underline"
        to="/posts/"
      >
        查看全部日志 →
      </NuxtLink>
    </section>

    <!-- 个人档案 -->
    <section :class="WIDGET_CLASS">
      <h2 :class="TITLE_CLASS">个人档案</h2>
      <!-- 用 <ul> 承载：<li> 必须位于列表容器内，否则是非法嵌套 -->
      <ul class="m-0 list-none p-0">
        <li
          v-for="line in [
            '兴趣爱好：打游戏、听音乐、看视频、户外散步、偶尔写点东西',
            '喜欢玩的游戏：逃跑吧少年、蛋仔派对、我的世界、植物大战僵尸2、保卫萝卜4、光遇',
            '主阵地：逃少音乐档案馆（B站 & WP 独立站）',
          ]"
          :key="line"
          class="relative line-clamp-4 py-[6px] pl-3.5 text-[13.8px] leading-[1.55] text-ink-2 before:absolute before:top-3.5 before:left-0.5 before:size-[5px] before:rotate-45 before:bg-accent before:content-['']"
        >
          {{ line }}
        </li>
      </ul>
    </section>

    <!-- 工具矩阵 -->
    <section :class="WIDGET_CLASS">
      <h2 :class="TITLE_CLASS">工具矩阵</h2>
      <div>
        <NuxtLink v-for="tool in TOOL_LINKS" :key="tool.slug" :class="ITEM_CLASS" :to="`/tools/${tool.slug}`">
          {{ tool.name }}
        </NuxtLink>
        <NuxtLink :class="ITEM_CLASS" to="/tools/">更多工具 →</NuxtLink>
      </div>
    </section>

    <!-- 友情链接 -->
    <section :class="WIDGET_CLASS">
      <h2 :class="TITLE_CLASS">友情链接</h2>
      <div class="flex flex-col gap-2">
        <a
          v-for="link in SOCIAL_LINKS"
          :key="link.href"
          class="mecha-clip-dual flex items-center gap-2 border border-line bg-card px-2.5 py-[7px] text-[13.5px] text-ink-2 transition-colors hover:border-edge hover:bg-accent-soft hover:text-accent-2"
          :href="link.href"
          target="_blank"
          rel="noopener"
        >
          <Icon :name="link.icon" class="size-[17px] shrink-0 text-ink-3" />
          <span>{{ link.label }}</span>
        </a>
      </div>
      <p class="mt-2.5 text-[13px] leading-[1.65] text-ink-3">
        部分链接可能会失效，我如果有时间会及时更新的。
      </p>
    </section>

    <!-- 公告 -->
    <section :class="WIDGET_CLASS">
      <h2 :class="TITLE_CLASS">公告</h2>
      <div
        v-for="item in NOTICE"
        :key="item.date"
        class="flex gap-2.5 py-1.5 text-[13.2px] leading-[1.6] text-ink-2"
      >
        <span class="flex-none font-mono text-[11.5px] text-accent-2">{{ item.date }}</span>
        <span>{{ item.text }}</span>
      </div>
    </section>
  </aside>
</template>
