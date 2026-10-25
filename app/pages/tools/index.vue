<script setup lang="ts">
import { TOOL_LINKS } from '#shared/site';

useHead({ title: '工具箱' });
</script>

<template>
  <div class="mx-auto max-w-page">
    <header class="mb-6 border-b border-line pb-4">
      <h1 class="mecha-title">工具箱</h1>
      <p class="mt-2 text-[13px] text-ink-3">纯前端运行，数据不上传服务器</p>
    </header>

    <div class="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
      <NuxtLink
        v-for="tool in TOOL_LINKS"
        :key="tool.slug"
        class="group mecha-clip-s border border-line bg-card p-5 transition-colors hover:border-edge hover:bg-accent-soft"
        :to="`/tools/${tool.slug}`"
      >
        <h2 class="flex items-center gap-2 text-[15.5px] font-semibold text-ink">
          <Icon name="i-lucide-wrench" class="size-4 text-accent-2" />
          {{ tool.name }}
        </h2>
        <p class="mt-2 text-[13px] leading-[1.65] text-ink-3">{{ tool.desc }}</p>
        <span class="mt-3 inline-flex items-center gap-1 font-mono text-[12px] text-accent-2">
          打开
          <Icon name="i-lucide-arrow-right" class="size-3.5" />
        </span>
      </NuxtLink>
    </div>
  </div>
</template>
