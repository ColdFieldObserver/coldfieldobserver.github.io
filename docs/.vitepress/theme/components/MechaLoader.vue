<script setup lang="ts">
import { onMounted, ref } from 'vue';

// ============================================================
// 机甲风格加载动画（版式 / 动画对齐 CFO_Future/index.html）
//   旋转装甲环 + 六边形脉冲核心 + LOADING 逐字闪烁 + 进度条，
//   约 3.2s 后整体淡出并从文档流移除。
// ============================================================
const visible = ref(true);
const root = ref<HTMLElement | null>(null);

/** 动画结束（淡出完成后）移除 DOM */
function onAnimationEnd(event: AnimationEvent): void {
  if (event.animationName === 'loaderFadeOut') hide();
}

let removed = false;

function hide(): void {
  if (removed) return;
  removed = true;
  visible.value = false;
}

onMounted(() => {
  // 安全后备：无论动画是否正常触发，4s 后强制收起
  window.setTimeout(hide, 4000);
});
</script>

<template>
  <div
    v-if="visible"
    ref="root"
    class="mecha-loader"
    role="status"
    aria-live="polite"
    aria-label="站点加载中"
    @animationend="onAnimationEnd"
  >
    <div class="loader-core">
      <div class="loader-ring" />
      <div class="loader-hex" />
    </div>

    <div class="loader-text" aria-hidden="true">
      <span>L</span><span>O</span><span>A</span><span>D</span><span>I</span><span>N</span><span>G</span>
    </div>

    <div class="loader-bar" />

    <!-- 装饰性文案：对辅助技术隐藏，同时避免被正文提取实现当成页面文字抓取 -->
    <p class="loader-sub" aria-hidden="true">// COLD FIELD OBSERVER · SYSTEM BOOT</p>
  </div>
</template>

<style scoped lang="scss">
@use '../styles/variables' as *;

.mecha-loader {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 28px;
  background-color: var(--bg-deep);
  background-image: radial-gradient(circle at 50% 50%, var(--accent-soft) 0%, transparent 60%),
    linear-gradient(var(--grid-line) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
  background-size: 100% 100%, 40px 40px, 40px 40px;
  animation: loaderFadeOut 0.6s ease-in-out 2.6s forwards;
}

// ---- 加载核心：旋转装甲环 + 六边形 ----
.loader-core {
  position: relative;
  width: 140px;
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loader-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 3px solid transparent;
  border-top-color: var(--accent);
  border-right-color: var(--accent-2);
  border-bottom-color: transparent;
  border-left-color: var(--accent);
  animation: spinRing 1.8s linear infinite;

  &::before {
    content: '';
    position: absolute;
    inset: 8px;
    border-radius: 50%;
    border: 2px solid transparent;
    border-top-color: var(--ink-2);
    border-bottom-color: var(--accent);
    animation: spinRingReverse 1.2s linear infinite;
  }
}

.loader-hex {
  position: relative;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--panel);
  border: 2px solid var(--accent);
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  animation: corePulse 1.4s ease-in-out infinite;

  &::after {
    content: '';
    position: absolute;
    inset: 6px;
    background: var(--accent);
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
    opacity: 0.6;
    animation: coreGlow 1.4s ease-in-out infinite alternate;
  }
}

.loader-text {
  display: flex;
  align-items: center;
  gap: 4px;
  font-family: $font-mono;
  font-size: 1.05rem;
  font-weight: 600;
  letter-spacing: 6px;
  text-transform: uppercase;
  color: var(--ink-2);

  span {
    display: inline-block;
    animation: textBlink 1.5s ease-in-out infinite;
  }

  span:nth-child(1) {
    animation-delay: 0s;
  }
  span:nth-child(2) {
    animation-delay: 0.2s;
  }
  span:nth-child(3) {
    animation-delay: 0.4s;
  }
  span:nth-child(4) {
    animation-delay: 0.6s;
  }
  span:nth-child(5) {
    animation-delay: 0.8s;
  }
  span:nth-child(6) {
    animation-delay: 1s;
  }
  span:nth-child(7) {
    animation-delay: 1.2s;
  }
}

.loader-sub {
  font-family: $font-mono;
  font-size: 11.5px;
  letter-spacing: 1.5px;
  color: var(--ink-3);
}

// ---- 进度条 ----
.loader-bar {
  position: relative;
  width: 220px;
  height: 6px;
  overflow: hidden;
  background: var(--panel);
  border: 1px solid var(--line);
  clip-path: polygon(0 0, 100% 0, 100% 100%, 6px 100%, 0 calc(100% - 6px));

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 0;
    background: var(--accent-grad);
    animation: loadProgress 2.4s ease-in-out forwards;
  }
}

@keyframes spinRing {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes spinRingReverse {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(-360deg);
  }
}

@keyframes corePulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.08);
  }
}

@keyframes coreGlow {
  0% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.9;
  }
}

@keyframes textBlink {
  0%,
  100% {
    opacity: 1;
    color: var(--ink);
  }
  50% {
    opacity: 0.3;
    color: var(--accent);
  }
}

@keyframes loadProgress {
  0% {
    width: 0%;
  }
  20% {
    width: 18%;
  }
  40% {
    width: 42%;
  }
  60% {
    width: 65%;
  }
  80% {
    width: 88%;
  }
  100% {
    width: 100%;
  }
}

@keyframes loaderFadeOut {
  0% {
    opacity: 1;
    visibility: visible;
  }
  99% {
    opacity: 0;
    visibility: visible;
  }
  100% {
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
  }
}

// 尊重系统「减少动态效果」偏好：直接不展示长时间动画
@media (prefers-reduced-motion: reduce) {
  .mecha-loader {
    animation: loaderFadeOut 0.3s ease-in-out 0.4s forwards;
  }

  .loader-ring,
  .loader-ring::before,
  .loader-hex,
  .loader-hex::after,
  .loader-text span,
  .loader-bar::before {
    animation: none;
  }
}
</style>
