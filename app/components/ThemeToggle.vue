<script setup lang="ts">
import { computed } from 'vue';
import { useTheme, type ThemeMode } from '~/composables/useTheme';

// 主题切换按钮：三态循环（跟随系统 → 浅色 → 深色），图标随当前模式变化。
// 顶栏只用图标按钮，具体模式靠 title / aria-label 与图标本身表达。
const { mode, cycle } = useTheme();

const LABELS: Record<ThemeMode, string> = {
  auto: '跟随系统',
  light: '浅色模式',
  dark: '深色模式',
};

const ICONS: Record<ThemeMode, string> = {
  auto: 'i-lucide-monitor',
  light: 'i-lucide-sun',
  dark: 'i-lucide-moon',
};

const label = computed(() => LABELS[mode.value]);
</script>

<template>
  <UButton
    variant="ghost"
    color="neutral"
    square
    :icon="ICONS[mode]"
    :title="`当前：${label}（点击切换）`"
    :aria-label="`切换主题，当前${label}`"
    @click="cycle"
  />
</template>
