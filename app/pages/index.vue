<script setup lang="ts">
import { computed } from 'vue';
import { SITE, TOOL_LINKS } from '#shared/site';
import { AVATAR, GAME_IDS, HERO_INTRO, PROJECTS, SITE_NOTE } from '~/data/home';
import { PERSONAL_PROFILE, SOCIAL_LINKS, TIMELINE } from '~/data/profile';
import { latestPosts, useAllPosts } from '~/composables/usePosts';

// ============================================================
// 首页：Hero → 关于我 / 身份主线 → 最新日志 → 我的项目
//       → 我的游戏 ID → 工具矩阵 → 关于这个站点
// 「最新日志」「个人档案」「工具矩阵」原在右侧栏，右栏移除后搬到这里。
// ============================================================
const allPosts = useAllPosts();
const latest = computed(() => latestPosts(allPosts.value, 3));

/** 工具矩阵：桌面一行四张卡，取前四个代表作 */
const TOOL_FEATURED = TOOL_LINKS.slice(0, 4);

const avatarSrc = withBase(AVATAR);

useHead({ title: SITE.title });
</script>

<template>
  <div class="mx-auto max-w-page">
    <!-- 1. Hero：圆形头像 + 标题 + 简介 + 社交按钮 -->
    <section class="hero-grid -mx-4 px-4 py-10 text-center sm:-mx-6 sm:px-6 lg:py-14">
      <img
        class="mx-auto size-28 rounded-full object-cover ring-4 ring-primary/15 lg:size-32"
        :src="avatarSrc"
        alt="冷域观者的头像"
        width="512"
        height="512"
        decoding="async"
        fetchpriority="high"
      />
      <h1
        class="mx-auto mt-6 max-w-[22em] text-[clamp(26px,4.6vw,40px)] leading-[1.2] font-extrabold tracking-tight text-highlighted"
      >
        欢迎来到冷域观者的博客网站
      </h1>
      <p class="mx-auto mt-4 max-w-[620px] text-[15.5px] leading-[1.9] text-toned">
        {{ HERO_INTRO }}
      </p>

      <!-- 个人档案：Hero 下方的胶囊列表 -->
      <ul class="mt-6 flex flex-col items-center gap-1.5 text-sm text-toned sm:flex-row sm:flex-wrap sm:justify-center">
        <li
          v-for="line in PERSONAL_PROFILE"
          :key="line"
          class="rounded-full border border-default px-3 py-1"
        >
          {{ line }}
        </li>
      </ul>

      <div class="mt-6 flex flex-wrap items-center justify-center gap-2.5">
        <UButton
          v-for="link in SOCIAL_LINKS"
          :key="link.url"
          :to="link.url"
          target="_blank"
          rel="noopener"
          :icon="link.icon"
          :label="link.name"
          size="lg"
          :variant="link.name === 'GitHub' ? 'outline' : 'solid'"
          :color="link.name === 'GitHub' ? 'neutral' : 'primary'"
        />
      </div>
    </section>

    <!-- 2. 关于我 / 身份主线经历 -->
    <section class="mt-4 grid gap-6 lg:grid-cols-2">
      <UCard>
        <template #header>
          <h2 class="flex items-center gap-2 text-lg font-bold text-highlighted">
            <UIcon name="i-lucide-info" class="size-5 text-primary" aria-hidden="true" />
            关于我
          </h2>
        </template>
        <ul class="flex flex-col gap-3">
          <li v-for="line in PERSONAL_PROFILE" :key="line" class="flex gap-2 text-sm leading-[1.8] text-toned">
            <UIcon
              name="i-lucide-chevron-right"
              class="mt-1 size-4 shrink-0 text-primary"
              aria-hidden="true"
            />
            <span>{{ line }}</span>
          </li>
        </ul>
      </UCard>

      <UCard>
        <template #header>
          <h2 class="flex items-center gap-2 text-lg font-bold text-highlighted">
            <UIcon name="i-lucide-tags" class="size-5 text-primary" aria-hidden="true" />
            身份主线经历
          </h2>
        </template>
        <UTimeline :items="TIMELINE" size="sm" />
      </UCard>
    </section>

    <!-- 3. 最新日志 -->
    <UPageSection
      class="mt-12"
      title="最新日志"
      description="不定时更新的记录、折腾与归档。"
      :ui="{ container: 'py-0! gap-5' }"
    >
      <CardGrid :posts="latest" empty-text="暂无日志" />
      <template #footer>
        <div class="flex justify-center">
          <UButton to="/posts/" size="lg" trailing-icon="i-lucide-arrow-right" label="查看全部日志" />
        </div>
      </template>
    </UPageSection>

    <!-- 4. 我的项目 -->
    <UPageSection
      class="mt-12"
      title="我的项目"
      description="长期在维护的两个站点。"
      :ui="{ container: 'py-0! gap-5' }"
    >
      <UPageGrid style="--grid-min: 280px">
        <UPageCard
          v-for="project in PROJECTS"
          :key="project.name"
          :icon="project.icon"
          :title="project.name"
          :description="project.description"
          variant="subtle"
          spotlight
        >
          <template #footer>
            <div class="flex flex-wrap items-center gap-3">
              <UButton
                :to="project.to"
                target="_blank"
                rel="noopener"
                variant="link"
                trailing-icon="i-lucide-arrow-up-right"
                :label="`打开 ${project.name}`"
                :padded="false"
              />
              <UButton
                v-if="project.extra"
                :to="project.extra.to"
                target="_blank"
                rel="noopener"
                variant="link"
                color="neutral"
                :label="project.extra.label"
                :padded="false"
              />
            </div>
          </template>
        </UPageCard>
      </UPageGrid>
    </UPageSection>

    <!-- 5. 我的游戏 ID：跑马灯 -->
    <UPageSection
      class="mt-12"
      title="我的游戏 ID"
      description="蛋仔派对的两个号。"
      :ui="{ container: 'py-0! gap-5' }"
    >
      <UMarquee :repeat="2" pause-on-hover :overlay="false" class="id-marquee">
        <UCard v-for="item in GAME_IDS" :key="item.name" class="w-[260px] shrink-0">
          <a
            class="block overflow-hidden rounded-lg border border-default bg-muted"
            :href="item.image"
            target="_blank"
            rel="noopener"
          >
            <img
              :src="item.image"
              :alt="`我的蛋仔派对${item.note}`"
              loading="lazy"
              decoding="async"
              class="w-full"
            />
          </a>
          <div class="mt-3 flex items-center gap-2">
            <UBadge color="primary" variant="soft" size="sm" :label="item.note" />
            <span class="text-sm text-toned">{{ item.name }}</span>
          </div>
        </UCard>
      </UMarquee>
    </UPageSection>

    <!-- 6. 工具矩阵：只展示三个代表 -->
    <UPageSection
      class="mt-12"
      title="工具矩阵"
      description="纯前端运行，数据不上传服务器。"
      :ui="{ container: 'py-0! gap-5' }"
    >
      <UPageGrid style="--grid-min: 250px">
        <UPageCard
          v-for="tool in TOOL_FEATURED"
          :key="tool.slug"
          :to="`/tools/${tool.slug}`"
          icon="i-lucide-wrench"
          :title="tool.name"
          :description="tool.desc"
          variant="outline"
        />
      </UPageGrid>
      <template #footer>
        <div class="flex justify-center">
          <UButton to="/tools/" variant="soft" color="neutral" label="更多工具" trailing-icon="i-lucide-arrow-right" />
        </div>
      </template>
    </UPageSection>

    <!-- 7. 关于这个站点 -->
    <UPageSection
      class="mt-12 mb-4"
      title="关于这个站点"
      description="一点必要的交代。"
      :ui="{ container: 'py-0! gap-5' }"
    >
      <UCard>
        <div class="flex flex-col gap-3 text-[15px] leading-[1.9] text-toned">
          <p v-for="(seg, index) in SITE_NOTE" :key="index">
            <del v-if="seg.struck" class="text-dimmed">{{ seg.text }}</del>
            <template v-else>{{ seg.text }}</template>
          </p>
          <p class="text-sm text-dimmed">
            站点基于 Nuxt 4 + Nuxt UI 构建，纯静态托管于 GitHub Pages；不引入第三方统计脚本，
            仅使用 Giscus 承载评论。
          </p>
        </div>
        <template #footer>
          <div class="flex flex-wrap items-center gap-2">
            <!-- 订阅源由 server/routes 生成，不是页面：这里必须用裸 <a>，
                 走 NuxtLink 会让 vue-router 找不到路由而报 R0004 -->
            <UButton
              :to="withBase('/atom.xml')"
              external
              variant="ghost"
              icon="i-lucide-rss"
              label="RSS 订阅"
            />
            <UButton
              to="https://github.com/ColdFieldObserver"
              target="_blank"
              rel="noopener"
              variant="ghost"
              color="neutral"
              icon="i-simple-icons-github"
              label="站点源码"
            />
          </div>
        </template>
      </UCard>
    </UPageSection>
  </div>
</template>

<style scoped>
/* Hero 区域的网格底纹：机甲时代留下的唯一一处纹理，只在这里用。
   网格画在 ::before 上而不是 section 自身的 background 上：
   mask-image 会作用于元素**及其全部后代**，直接给 section 加 mask 会让
   底部的社交按钮跟着网格一起淡出（表现为按钮被一层渐变「盖住」）。
   拆成伪元素后，淡出只影响背景，内容永远是不透明的。 */
.hero-grid {
  position: relative;
  isolation: isolate;
}

.hero-grid::before {
  position: absolute;
  z-index: -1;
  inset: 0;
  background-image:
    linear-gradient(var(--grid-line) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
  background-size: 36px 36px;
  background-position: center;
  /* 四边淡出，避免网格在区块边界被硬切 */
  mask-image: radial-gradient(120% 100% at 50% 0%, #000 45%, transparent 100%);
  content: '';
  pointer-events: none;
}

/* UMarquee 默认 gap 是 64px、一圈 20s；这里与卡片间距对齐并放慢 */
.id-marquee {
  --gap: 16px;
  --duration: 40s;
}
</style>
