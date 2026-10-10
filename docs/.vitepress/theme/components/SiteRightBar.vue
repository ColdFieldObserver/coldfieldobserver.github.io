<script setup lang="ts">
import { computed } from 'vue';
import { withBase } from 'vitepress';
import { SOCIAL_LINKS, TOOL_LINKS } from '@/config';
import { latestPosts } from '@/composables/usePosts';
import { activeMobileDrawer } from '@/composables/useMobileDrawer';

// ============================================================
// 右侧部件栏：内容承袭原项目右侧边栏
//   最新日志 / 个人档案 / 工具矩阵 / 友情链接 / 公告
//   （原项目的版权信息已移至「关于」页，见 AboutView）
// ============================================================
const posts = latestPosts(5);
const drawerOpen = computed(() => activeMobileDrawer.value === 'right');

const NOTICE = [
  { date: '2026-05-13', text: '更换 B 站账号。' },
  { date: '2026-05-03', text: '个人博客迎来重大更新。' },
];
</script>

<template>
  <aside id="sidebar-right" class="sidebar-right" :class="{ open: drawerOpen }" aria-label="侧边栏">
    <!-- 最新日志 -->
    <section class="widget">
      <h2 class="widget-title">最新日志</h2>
      <div class="widget-list">
        <a v-for="post in posts" :key="post.url" :href="withBase(post.url)">{{ post.title }}</a>
        <p v-if="!posts.length" class="widget-empty">暂无日志</p>
      </div>
      <a class="widget-more" :href="withBase('/posts/')">查看全部日志 →</a>
    </section>

    <!-- 个人档案（原项目右侧边栏） -->
    <section class="widget">
      <h2 class="widget-title">个人档案</h2>
      <div class="widget-list profile">
        <li>兴趣爱好：打游戏、听音乐、看视频、户外散步、偶尔写点东西</li>
        <li>喜欢玩的游戏：逃跑吧少年、蛋仔派对、我的世界、植物大战僵尸2、保卫萝卜4、光遇</li>
        <li>主阵地：逃少音乐档案馆（B站 &amp; WP独立站）</li>
      </div>
    </section>

    <!-- 工具矩阵（原项目工具清单 + 新增工具） -->
    <section class="widget">
      <h2 class="widget-title">工具矩阵</h2>
      <div class="widget-list">
        <a v-for="tool in TOOL_LINKS" :key="tool.slug" :href="withBase(`/tools/${tool.slug}.html`)">
          {{ tool.name }}
        </a>
        <a :href="withBase('/tools/')">更多工具 →</a>
      </div>
    </section>

    <!-- 友情链接（原项目） -->
    <section class="widget">
      <h2 class="widget-title">友情链接</h2>
      <div class="social-links">
        <a
          v-for="link in SOCIAL_LINKS"
          :key="link.href"
          :href="link.href"
          target="_blank"
          rel="noopener"
        >
          <svg v-if="link.icon === 'github'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
          </svg>
          <svg v-else-if="link.icon === 'bilibili'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="3" />
            <line x1="7" y1="3" x2="9" y2="7" />
            <line x1="17" y1="3" x2="15" y2="7" />
            <line x1="8" y1="12" x2="8" y2="14" />
            <line x1="16" y1="12" x2="16" y2="14" />
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
          <span>{{ link.label }}</span>
        </a>
      </div>
      <p class="widget-note" style="margin-top: 10px">部分链接可能会失效，我如果有时间会及时更新的。</p>
    </section>

    <!-- 公告（原项目） -->
    <section class="widget">
      <h2 class="widget-title">公告</h2>
      <div class="notice-item" v-for="item in NOTICE" :key="item.date">
        <span class="notice-date">{{ item.date }}</span>
        <span>{{ item.text }}</span>
      </div>
    </section>
  </aside>
</template>

<style scoped lang="scss">
@use '../styles/variables' as *;
@use '../styles/mixins' as *;

// 个人档案条目：保留常规项目符号（widget-list 默认带虚线分隔）
.widget-list.profile li {
  padding-left: 14px;
  position: relative;
  @include clamp-lines(4);

  &::before {
    content: '';
    position: absolute;
    top: 14px;
    left: 2px;
    width: 5px;
    height: 5px;
    background: var(--accent);
    clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  }
}
</style>
