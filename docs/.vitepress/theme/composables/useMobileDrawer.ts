import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

export type MobileDrawer = 'left' | 'right';

/** 当前打开的抽屉（移动端），null 表示都关闭 */
export const activeMobileDrawer = ref<MobileDrawer | null>(null);

export function toggleMobileDrawer(drawer: MobileDrawer): void {
  activeMobileDrawer.value = activeMobileDrawer.value === drawer ? null : drawer;
}

export function closeMobileDrawer(): void {
  activeMobileDrawer.value = null;
}

const EDGE_SWIPE_WIDTH = 24;
const SWIPE_THRESHOLD = 56;

interface DrawerSwipeStart {
  pointerId: number;
  x: number;
  y: number;
  drawer: MobileDrawer;
  closing: boolean;
}

export function useMobileDrawerGestures(): void {
  let swipeStart: DrawerSwipeStart | null = null;

  const isMobile = () => window.matchMedia('(max-width: 1024px)').matches;

  const suppressClickAfterSwipe = () => {
    const preventClick = (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
    };
    document.addEventListener('click', preventClick, true);
    window.setTimeout(() => document.removeEventListener('click', preventClick, true), 0);
  };

  const onPointerDown = (event: PointerEvent) => {
    if (event.pointerType !== 'touch' || !event.isPrimary || !isMobile()) return;

    const currentDrawer = activeMobileDrawer.value;
    const target = event.target instanceof Element ? event.target : null;
    if (currentDrawer) {
      if (!target?.closest(`.sidebar-${currentDrawer}`)) return;
      swipeStart = {
        pointerId: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        drawer: currentDrawer,
        closing: true,
      };
      return;
    }

    const drawer =
      event.clientX <= EDGE_SWIPE_WIDTH
        ? 'left'
        : event.clientX >= window.innerWidth - EDGE_SWIPE_WIDTH
          ? 'right'
          : null;
    if (!drawer) return;
    swipeStart = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      drawer,
      closing: false,
    };
  };

  const onPointerUp = (event: PointerEvent) => {
    if (!swipeStart || event.pointerId !== swipeStart.pointerId) return;
    const start = swipeStart;
    swipeStart = null;
    if (!isMobile()) return;

    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    if (Math.abs(deltaX) < SWIPE_THRESHOLD || Math.abs(deltaX) < Math.abs(deltaY) * 1.25) return;

    if (start.closing) {
      const shouldClose = start.drawer === 'left' ? deltaX < 0 : deltaX > 0;
      if (shouldClose && activeMobileDrawer.value === start.drawer) {
        closeMobileDrawer();
        suppressClickAfterSwipe();
      }
      return;
    }

    const shouldOpen = start.drawer === 'left' ? deltaX > 0 : deltaX < 0;
    if (shouldOpen && activeMobileDrawer.value === null) {
      activeMobileDrawer.value = start.drawer;
      suppressClickAfterSwipe();
    }
  };

  const onPointerCancel = () => {
    swipeStart = null;
  };

  onMounted(() => {
    document.addEventListener('pointerdown', onPointerDown, { passive: true });
    document.addEventListener('pointerup', onPointerUp, { passive: true });
    document.addEventListener('pointercancel', onPointerCancel, { passive: true });
  });

  onBeforeUnmount(() => {
    document.removeEventListener('pointerdown', onPointerDown);
    document.removeEventListener('pointerup', onPointerUp);
    document.removeEventListener('pointercancel', onPointerCancel);
    swipeStart = null;
  });
}

/**
 * 抽屉展开时锁定页面滚动，避免遮罩下手内容跟随滚动；
 * 关闭（或组件卸载）时恢复。
 */
watch(activeMobileDrawer, (drawer) => {
  if (typeof document === 'undefined') return;
  document.body.classList.toggle('drawer-open', drawer !== null);
});
