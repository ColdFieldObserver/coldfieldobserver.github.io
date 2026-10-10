import { ref, watch } from 'vue';

export type MobileDrawer = 'left' | 'right';

/** 当前打开的抽屉（移动端），null 表示都关闭 */
export const activeMobileDrawer = ref<MobileDrawer | null>(null);

export function toggleMobileDrawer(drawer: MobileDrawer): void {
  activeMobileDrawer.value = activeMobileDrawer.value === drawer ? null : drawer;
}

export function closeMobileDrawer(): void {
  activeMobileDrawer.value = null;
}

/**
 * 抽屉展开时锁定页面滚动，避免遮罩下手内容跟随滚动；
 * 关闭（或组件卸载）时恢复。
 */
watch(activeMobileDrawer, (drawer) => {
  if (typeof document === 'undefined') return;
  document.body.classList.toggle('drawer-open', drawer !== null);
});
