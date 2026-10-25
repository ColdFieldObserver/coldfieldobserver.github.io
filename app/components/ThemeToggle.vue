<script setup lang="ts">
import { computed } from 'vue';
import { useTheme, type ThemeMode } from '~/composables/useTheme';

// 主题切换按钮：三态循环（跟随系统 → 浅色 → 深色），图标随当前模式变化
const { mode, cycle } = useTheme();

const LABELS: Record<ThemeMode, string> = {
  auto: '跟随系统',
  light: '浅色模式',
  dark: '深色模式',
};

const CODE: Record<ThemeMode, string> = {
  auto: 'AUTO',
  light: 'LIGHT',
  dark: 'DARK',
};

const ICONS: Record<ThemeMode, string> = {
  auto: 'i-lucide-monitor',
  light: 'i-lucide-sun',
  dark: 'i-lucide-moon',
};

const label = computed(() => LABELS[mode.value]);
</script>

<template>
  <button
    class="mecha-clip-dual mt-auto flex items-center gap-2.5 border border-line bg-panel px-3 py-2.5 text-[13.5px] text-ink-2 transition-colors hover:border-edge hover:bg-accent-soft hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55"
    type="button"
    :title="`当前：${label}（点击切换）`"
    :aria-label="`切换主题，当前${label}`"
    @click="cycle"
  >
    <span class="inline-flex size-5 shrink-0 text-accent-2" aria-hidden="true">
      <Icon :name="ICONS[mode]" class="size-5" />
    </span>

    <span class="flex flex-1 flex-col items-start leading-[1.25]">
      <span>{{ label }}</span>
      <span class="font-mono text-[10.5px] tracking-[1.4px] text-ink-3">{{ CODE[mode] }}</span>
    </span>

    <!-- 三档滑动指示灯 -->
    <span class="relative h-3 w-7 flex-none border border-line bg-panel" aria-hidden="true">
      <i
        class="absolute top-px size-2 bg-accent transition-[left,background-color] duration-200 [clip-path:polygon(50%_0,100%_50%,50%_100%,0_50%)]"
        :class="{
          'left-px': mode === 'auto',
          'left-[9px]': mode === 'light',
          'left-[17px]': mode === 'dark',
        }"
      />
    </span>
  </button>
</template>
