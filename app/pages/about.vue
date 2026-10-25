<script setup lang="ts">
import { SITE, SOCIAL_LINKS } from '#shared/site';

const COPYRIGHT = [
  '本站为个人非盈利站点，内容以原创与技术记录为主。',
  '站内引用的游戏素材、商标归其各自权利人所有，本站仅作非商业性展示。',
  '除特别注明外，本站代码与文字采用 MIT / CC BY-NC-SA 4.0 双许可（以具体仓库声明为准）。',
  '评论区由 Giscus 提供，登录与数据存储遵循 GitHub 的相关条款。',
];

useHead({ title: '关于' });
</script>

<template>
  <div class="mx-auto max-w-page">
    <header class="mb-6 border-b border-line pb-4">
      <h1 class="mecha-title">关于</h1>
      <p class="mt-2 text-[13px] text-ink-3">{{ SITE.codename }} · {{ SITE.author }}</p>
    </header>

    <div class="flex flex-col gap-5">
      <section class="mecha-clip-s border border-line bg-card p-6">
        <h2 class="mb-3 text-[15px] font-bold text-ink">关于本站</h2>
        <p class="text-[14.5px] leading-[1.85] text-ink-2">
          {{ SITE.description }}
        </p>
        <p class="mt-3 text-[14.5px] leading-[1.85] text-ink-2">
          站点基于 Nuxt 4 与 @nuxt/content 构建，纯静态托管于 GitHub Pages；不引入第三方统计脚本，
          仅使用 Giscus 承载评论。
        </p>
      </section>

      <section class="mecha-clip-s border border-line bg-card p-6">
        <h2 class="mb-3 text-[15px] font-bold text-ink">订阅与分发</h2>
        <ul class="flex flex-col gap-2 text-[14px] text-ink-2">
          <li class="flex items-center gap-2">
            <Icon name="i-lucide-rss" class="size-4 text-accent-2" />
            <a class="hover:underline" href="/atom.xml">Atom 订阅</a>
            <span class="text-ink-3">/</span>
            <a class="hover:underline" href="/rss.xml">RSS 2.0</a>
          </li>
          <li v-for="link in SOCIAL_LINKS.slice(0, 3)" :key="link.href" class="flex items-center gap-2">
            <Icon :name="link.icon" class="size-4 text-accent-2" />
            <a class="hover:underline" :href="link.href" target="_blank" rel="noopener">{{ link.label }}</a>
          </li>
        </ul>
      </section>

      <section class="mecha-clip-s border border-line bg-card p-6">
        <h2 class="mb-3 text-[15px] font-bold text-ink">版权与说明</h2>
        <ul class="ml-[1.4em] list-disc text-[14px] leading-[1.9] text-ink-2">
          <li v-for="item in COPYRIGHT" :key="item">{{ item }}</li>
        </ul>
      </section>
    </div>
  </div>
</template>
