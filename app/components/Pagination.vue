<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  /** 当前页（从 1 开始） */
  current: number;
  /** 总页数 */
  totalPages: number;
  /** 第 1 页地址，如 /posts/、/archives/ */
  firstHref: string;
  /** 第 n(>=2) 页地址前缀 */
  pagePrefix: string;
}>();

const prevHref = computed(() =>
  props.current <= 2 ? props.firstHref : `${props.pagePrefix}${props.current - 1}`,
);
const nextHref = computed(() => `${props.pagePrefix}${props.current + 1}`);

const BTN_CLASS =
  'mecha-clip-s border border-line bg-panel px-5 py-[7px] font-mono text-[12.5px] tracking-[0.5px] text-ink-2 transition-colors hover:border-accent hover:bg-accent hover:text-on-accent';
</script>

<template>
  <nav
    v-if="totalPages > 1"
    class="mt-8 flex items-center justify-center gap-3.5"
    role="navigation"
    aria-label="分页导航"
  >
    <NuxtLink v-if="current > 1" :class="BTN_CLASS" :to="prevHref">← 上一页</NuxtLink>
    <span v-else class="mecha-clip-s border border-line px-5 py-[7px] font-mono text-[12.5px] text-ink-3 opacity-60">
      ← 上一页
    </span>

    <span class="font-mono text-[12.5px] text-ink-3">{{ current }} / {{ totalPages }}</span>

    <NuxtLink v-if="current < totalPages" :class="BTN_CLASS" :to="nextHref">下一页 →</NuxtLink>
    <span v-else class="mecha-clip-s border border-line px-5 py-[7px] font-mono text-[12.5px] text-ink-3 opacity-60">
      下一页 →
    </span>
  </nav>
</template>
