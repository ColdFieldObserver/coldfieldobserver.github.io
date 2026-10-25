<script setup lang="ts">
import { SITE } from '#shared/site';
// ============================================================
// 首页：内容与原站保持一致
//   驾驶舱概览 → 站点模块 → 蛋仔派对 ID → 关于这个站点
// ============================================================

const EGGY_IDS = [
  { file: 'eggypartyid.jpg', name: '实况主灯塔', note: '大号' },
  { file: 'eggypartyid2.jpg', name: '翌测', note: '小号' },
];

const MODULES = [
  { label: '日志终端', desc: '按时间归档的全部记录', to: '/archives/', code: 'ARCHIVE' },
  { label: '工具矩阵', desc: 'Base64 / Unicode / 时间戳 / URL', to: '/tools/', code: 'TOOLS' },
  { label: 'RSS 订阅', desc: '用阅读器跟踪更新', to: '/atom.xml', code: 'FEED' },
];

useHead({ title: SITE.title });
</script>

<template>
  <div class="mx-auto max-w-page">
    <!-- 驾驶舱概览 -->
    <section class="mb-8 grid gap-5">
      <div class="mecha-clip-l relative border border-line bg-panel px-7 py-8">
        <p class="font-mono text-[11.5px] tracking-[2px] text-accent-2">
          // COLDFIELD OBSERVER · PERSONAL TERMINAL
        </p>
        <h1
          class="mt-3 text-[clamp(26px,4.5vw,38px)] leading-[1.25] font-extrabold tracking-[1px] text-ink"
        >
          欢迎来到冷域观者的个人网站！
        </h1>
        <div class="mt-4 flex flex-col gap-3 text-[14.5px] leading-[1.85] text-ink-2">
          <p>
            我是冷域观者，一个逃跑吧少年和蛋仔派对玩家，偶尔也玩我的世界、PVZ2
            和保卫萝卜4，同时还是逃少音乐档案馆的主理人。
          </p>
          <p>
            曾用名 AsyncObserver、蛋仔派对远航蛋、主唱耀星_Eggy、UNI-航行的灯塔、TP-RLX-LIGHT
            等，喜欢数码和技术。我也接触过编程，C、C++、C#、Python、HTML、CSS、JavaScript
            都懂一点，有时候也会试着用别的语言重构几个易语言项目玩玩（易语言的缺点你们懂的）。
          </p>
          <p>这里是我的个人网站。当然我不在这里发博文，就提供一些工具和资源导航。</p>
        </div>

        <div class="mt-6 flex flex-wrap gap-3">
          <NuxtLink class="mecha-btn primary" to="/posts/">进入日志终端</NuxtLink>
          <NuxtLink class="mecha-btn" to="/tools/">打开工具矩阵</NuxtLink>
        </div>
      </div>

    </section>

    <!-- 站点模块 -->
    <section class="mb-8">
      <h2 class="mecha-title mb-4">站点模块</h2>
      <div class="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
        <NuxtLink
          v-for="item in MODULES"
          :key="item.to"
          class="group mecha-clip-s relative flex flex-col gap-1.5 border border-line bg-card px-4 py-4 transition-colors hover:border-edge hover:bg-accent-soft"
          :to="item.to"
        >
          <span class="font-mono text-[10.5px] tracking-[1.6px] text-ink-3">{{ item.code }}</span>
          <span class="flex items-center gap-2 text-[15.5px] font-semibold text-ink">
            {{ item.label }}
            <Icon
              name="i-lucide-arrow-right"
              class="size-4 text-accent-2 transition-colors group-hover:text-accent"
            />
          </span>
          <span class="text-[13px] leading-[1.6] text-ink-3">{{ item.desc }}</span>
        </NuxtLink>
      </div>
    </section>

    <!-- 我的蛋仔派对 ID -->
    <section class="mb-8">
      <h2 class="mecha-title mb-4">我的蛋仔派对ID</h2>
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <figure
          v-for="item in EGGY_IDS"
          :key="item.file"
          class="mecha-clip-s m-0 border border-line bg-card p-3"
        >
          <a
            class="block overflow-hidden border border-line bg-accent-soft"
            :href="`/images/${item.file}`"
            target="_blank"
            rel="noopener"
          >
            <img
              :src="`/images/${item.file}`"
              :alt="`我的蛋仔派对${item.note}`"
              loading="lazy"
              class="w-full transition-transform duration-300 hover:scale-[1.02]"
            />
          </a>
          <figcaption class="mt-2.5 flex items-center gap-2">
            <span class="mecha-tag text-[11px]">{{ item.note }}</span>
            <span class="text-[13.5px] text-ink-2">{{ item.name }}</span>
          </figcaption>
        </figure>
      </div>
    </section>

    <!-- 关于这个站点 -->
    <section class="mb-2">
      <h2 class="mecha-title mb-4">关于这个站点</h2>
      <div class="mecha-clip-s border border-line bg-card p-6 text-[14.5px] leading-[1.9] text-ink-2">
        <p>
          这个网站的框架是用AI搭的，我只负责内容填充。不过，说句实话，如果我不给复杂的提示词，AI也生成不出来这种“风格缝合怪”的网站。<del
            class="text-ink-3"
            >另外，AI总是喜欢把HTML代码和CSS、JS代码写一块，即使我特意说明分离也是如此。</del
          >最终思考权还是在人类手中。
        </p>
      </div>
    </section>
  </div>
</template>
