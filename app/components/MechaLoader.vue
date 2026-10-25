<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

// ============================================================
// 机甲开机动画（仅首访）
//
// 关键：**默认不显示**，只有 <html class="booting"> 时才出现。
//   - booting 由 head 的同步脚本按 sessionStorage 首次访问写入；
//   - 禁用 JS 时脚本不执行 → 永远不会加上 booting → 遮罩不出现，
//     页面直接可读（旧实现 v-if 默认 true，无 JS 时整页被永久遮住）。
//   - 时长压到 1.2s 内，1.6s 兜底强制收起。
// ============================================================
const done = ref(false);
let timer: number | undefined;

function finish(): void {
  if (done.value) return;
  document.documentElement.classList.remove('booting');
  done.value = true;
  if (timer !== undefined) {
    window.clearTimeout(timer);
    timer = undefined;
  }
}

onMounted(() => {
  const root = document.documentElement;
  if (!root.classList.contains('booting')) {
    done.value = true;
    return;
  }
  // 系统要求减少动态效果：不播动画，立即收起
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    finish();
    return;
  }
  timer = window.setTimeout(finish, 1600);
});

onBeforeUnmount(() => {
  if (timer !== undefined) window.clearTimeout(timer);
});
</script>

<template>
  <div
    v-if="!done"
    class="mecha-loader"
    role="status"
    aria-live="polite"
    aria-label="站点加载中"
    @animationend="
      (event) => {
        if (event.animationName === 'loaderFadeOut') finish();
      }
    "
  >
    <div class="loader-core">
      <div class="loader-ring" />
      <div class="loader-hex" />
    </div>

    <div class="loader-text" aria-hidden="true">
      <span>L</span><span>O</span><span>A</span><span>D</span><span>I</span><span>N</span><span>G</span>
    </div>

    <div class="loader-bar" />

    <p class="loader-sub" aria-hidden="true">// COLD FIELD OBSERVER · SYSTEM BOOT</p>
  </div>
</template>

<style scoped>
/* 默认隐藏：只有 JS 判定首访并加上 html.booting 后才出现 */
.mecha-loader {
  display: none;
  position: fixed;
  inset: 0;
  z-index: 9999;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 28px;
  background-color: var(--bg-deep);
  background-image: radial-gradient(circle at 50% 50%, var(--accent-soft) 0%, transparent 60%),
    linear-gradient(var(--grid-line) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
  background-size: 100% 100%, 40px 40px, 40px 40px;
  animation: loaderFadeOut 0.4s ease 0.8s forwards;
}

html.booting .mecha-loader {
  display: flex;
}

.loader-core {
  position: relative;
  width: 140px;
  height: 140px;
  display: grid;
  place-items: center;
}

/* 旋转装甲环：两段弧 + 缺口，模拟舱门锁环 */
.loader-ring {
  position: absolute;
  inset: 0;
  border: 2px solid transparent;
  border-top-color: var(--accent);
  border-right-color: var(--accent-2);
  border-radius: 50%;
  animation: loaderSpin 1.1s linear infinite;
}

.loader-ring::after {
  content: '';
  position: absolute;
  inset: 12px;
  border: 1px dashed var(--edge);
  border-radius: 50%;
  opacity: 0.6;
}

/* 六边形脉冲核心 */
.loader-hex {
  width: 42px;
  height: 42px;
  background: var(--accent-grad);
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  animation: loaderPulse 1.2s ease-in-out infinite;
}

.loader-text {
  display: flex;
  gap: 4px;
  font-family: var(--font-code);
  font-size: 13px;
  letter-spacing: 4px;
  color: var(--accent-2);
}

.loader-text span {
  animation: loaderBlink 1.4s ease-in-out infinite;
}

.loader-text span:nth-child(2) {
  animation-delay: 0.1s;
}

.loader-text span:nth-child(3) {
  animation-delay: 0.2s;
}

.loader-text span:nth-child(4) {
  animation-delay: 0.3s;
}

.loader-text span:nth-child(5) {
  animation-delay: 0.4s;
}

.loader-text span:nth-child(6) {
  animation-delay: 0.5s;
}

.loader-text span:nth-child(7) {
  animation-delay: 0.6s;
}

.loader-bar {
  width: 180px;
  height: 3px;
  background: var(--line);
  overflow: hidden;
}

.loader-bar::after {
  content: '';
  display: block;
  height: 100%;
  width: 40%;
  background: var(--accent-grad);
  animation: loaderSlide 0.9s ease-in-out infinite;
}

.loader-sub {
  font-family: var(--font-code);
  font-size: 10.5px;
  letter-spacing: 2px;
  color: var(--ink-3);
}

@keyframes loaderFadeOut {
  to {
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
  }
}

@keyframes loaderSpin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes loaderPulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.9;
  }

  50% {
    transform: scale(1.12);
    opacity: 1;
  }
}

@keyframes loaderBlink {
  0%,
  100% {
    opacity: 0.25;
  }

  50% {
    opacity: 1;
  }
}

@keyframes loaderSlide {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(250%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .mecha-loader {
    animation: none;
    display: none;
  }
}
</style>
