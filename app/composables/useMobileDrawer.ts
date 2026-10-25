import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

export type MobileDrawer = 'left' | 'right';

/** 当前打开的抽屉（移动端），null 表示都关闭 */
export const activeMobileDrawer = ref<MobileDrawer | null>(null);

/**
 * 抽屉的实时展开进度 0→1（对齐参考站的做法）。
 * 拖动过程中遮罩的透明度、模糊与面板阴影都跟着它线性变化 ——
 * 而不是等手指松开才「啪」地出现/消失。
 * 写入 <html> 的自定义属性，CSS 里用 var(--drawer-progress) 取值。
 */
export const drawerProgress = ref(0);

function setProgress(value: number): void {
  const next = Math.max(0, Math.min(1, value));
  drawerProgress.value = next;
  if (typeof document !== 'undefined') {
    document.documentElement.style.setProperty('--drawer-progress', String(next));
  }
}

setProgress(0);

/** 拖动期间给 body 加标记：遮罩立即显形并暂时禁用过渡 */
function setDragging(active: boolean): void {
  if (typeof document === 'undefined') return;
  document.body.classList.toggle('drawer-dragging', active);
}

export function toggleMobileDrawer(drawer: MobileDrawer): void {
  const open = activeMobileDrawer.value === drawer;
  activeMobileDrawer.value = open ? null : drawer;
  setProgress(open ? 0 : 1);
}

export function closeMobileDrawer(): void {
  activeMobileDrawer.value = null;
  setProgress(0);
}

const EDGE_SWIPE_WIDTH = 40;
const SWIPE_THRESHOLD = 56;

interface DrawerSwipeStart {
  pointerId: number;
  x: number;
  y: number;
  drawer: MobileDrawer;
  panel: HTMLElement;
  closing: boolean;
  axis: 'pending' | 'horizontal' | 'vertical';
  dragging: boolean;
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

  const clearDrag = (panel: HTMLElement) => {
    panel.classList.remove('is-dragging');
    panel.style.removeProperty('transform');
  };

  const onPointerDown = (event: PointerEvent) => {
    if (event.pointerType !== 'touch' || !event.isPrimary || !isMobile()) return;

    const currentDrawer = activeMobileDrawer.value;
    const target = event.target instanceof Element ? event.target : null;
    if (currentDrawer) {
      if (!target?.closest(`.sidebar-${currentDrawer}`)) return;
      const panel = document.querySelector<HTMLElement>(`.sidebar-${currentDrawer}`);
      if (!panel) return;
      swipeStart = {
        pointerId: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        drawer: currentDrawer,
        panel,
        closing: true,
        axis: 'pending',
        dragging: false,
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
    const panel = document.querySelector<HTMLElement>(`.sidebar-${drawer}`);
    if (!panel) return;
    swipeStart = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      drawer,
      panel,
      closing: false,
      axis: 'pending',
      dragging: false,
    };
  };

  const onPointerMove = (event: PointerEvent) => {
    if (!swipeStart || event.pointerId !== swipeStart.pointerId) return;
    const deltaX = event.clientX - swipeStart.x;
    const deltaY = event.clientY - swipeStart.y;
    if (swipeStart.axis === 'pending') {
      if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < 8) return;
      swipeStart.axis = Math.abs(deltaX) >= Math.abs(deltaY) * 1.25 ? 'horizontal' : 'vertical';
    }
    if (swipeStart.axis === 'vertical') return;

    const width = swipeStart.panel.offsetWidth;
    if (!width) return;
    const directedDistance = swipeStart.closing
      ? swipeStart.drawer === 'left' ? -deltaX : deltaX
      : swipeStart.drawer === 'left' ? deltaX : -deltaX;
    if (directedDistance <= 0) {
      if (swipeStart.dragging) clearDrag(swipeStart.panel);
      swipeStart.dragging = false;
      return;
    }

    let offset: number;
    if (swipeStart.closing) {
      offset = swipeStart.drawer === 'left'
        ? Math.max(-width, Math.min(0, deltaX))
        : Math.min(width, Math.max(0, deltaX));
    } else {
      const progress = swipeStart.drawer === 'left'
        ? Math.max(0, Math.min(width, deltaX))
        : Math.max(0, Math.min(width, -deltaX));
      offset = swipeStart.drawer === 'left' ? progress - width : width - progress;
    }

    swipeStart.panel.classList.add('is-dragging');
    swipeStart.panel.style.transform = `translateX(${offset}px)`;
    if (!swipeStart.dragging) setDragging(true);
    swipeStart.dragging = true;

    // 展开进度：关闭态从 1 递减，打开态从 0 递增
    const ratio = Math.min(1, directedDistance / width);
    setProgress(swipeStart.closing ? 1 - ratio : ratio);
  };

  const onPointerUp = (event: PointerEvent) => {
    if (!swipeStart || event.pointerId !== swipeStart.pointerId) return;
    const start = swipeStart;
    swipeStart = null;
    if (!isMobile()) return;

    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    const directedDistance = start.closing
      ? start.drawer === 'left' ? -deltaX : deltaX
      : start.drawer === 'left' ? deltaX : -deltaX;
    const threshold = Math.max(SWIPE_THRESHOLD, start.panel.offsetWidth * 0.35);
    const shouldComplete =
      directedDistance >= threshold && Math.abs(deltaX) >= Math.abs(deltaY) * 1.25;

    setDragging(false);

    if (start.dragging && shouldComplete) {
      if (start.closing && activeMobileDrawer.value === start.drawer) {
        closeMobileDrawer();
      } else if (!start.closing && activeMobileDrawer.value === null) {
        activeMobileDrawer.value = start.drawer;
        setProgress(1);
      }
      void nextTick(() => clearDrag(start.panel));
      suppressClickAfterSwipe();
    } else if (start.dragging) {
      clearDrag(start.panel);
      // 没达到阈值：回到拖动前的状态
      setProgress(start.closing ? 1 : 0);
    }
  };

  const onPointerCancel = () => {
    if (swipeStart?.dragging) clearDrag(swipeStart.panel);
    setDragging(false);
    swipeStart = null;
  };

  onMounted(() => {
    document.addEventListener('pointerdown', onPointerDown, { passive: true });
    document.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointerup', onPointerUp, { passive: true });
    document.addEventListener('pointercancel', onPointerCancel, { passive: true });
  });

  onBeforeUnmount(() => {
    document.removeEventListener('pointerdown', onPointerDown);
    document.removeEventListener('pointermove', onPointerMove);
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
