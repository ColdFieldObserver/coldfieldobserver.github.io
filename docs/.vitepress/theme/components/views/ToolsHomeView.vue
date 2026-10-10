<script setup lang="ts">
import { withBase } from 'vitepress';
import { TOOL_LINKS } from '@/config';

// 工具列表页：TOOL_LINKS 是唯一数据源，右侧栏「工具矩阵」也复用它
</script>

<template>
  <div class="tools-home">
    <header class="tool-head">
      <h1>工具矩阵</h1>
      <p>这里提供了一些实用的在线工具，方便日常使用。全部在本地浏览器运行，不会上传任何数据。</p>
    </header>

    <div class="tool-grid">
      <a
        v-for="(tool, index) in TOOL_LINKS"
        :key="tool.slug"
        class="tool-card"
        :href="withBase(`/tools/${tool.slug}.html`)"
      >
        <span class="tool-index">{{ String(index + 1).padStart(2, '0') }}</span>
        <h2 class="tool-name">{{ tool.name }}</h2>
        <p class="tool-desc">{{ tool.desc }}</p>
        <span class="tool-enter">
          启动模块
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M5 12h14" />
            <path d="M12 5l7 7-7 7" />
          </svg>
        </span>
      </a>
    </div>

    <div class="info-block">
      <h2>说明</h2>
      <ul>
        <li>更多工具正在开发中，也欢迎提交你想要的转换 / 处理功能。</li>
        <li>所有计算均在你的浏览器内完成，输入内容不会离开本机。</li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '../../styles/variables' as *;
@use '../../styles/mixins' as *;

.tools-home {
  max-width: $max-w;
  margin: 0 auto;
}

.tool-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 18px;
}

.tool-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px 22px 22px;
  background: $card;
  border: 1px solid $line;
  clip-path: mecha-clip($cut-l);
  transition: border-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
  @include focus-ring;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: $accent-grad;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.32s cubic-bezier(0.22, 1, 0.36, 1);
  }

  &:hover {
    border-color: $edge;
    box-shadow: $shadow-brand;

    &::before {
      transform: scaleX(1);
    }

    .tool-enter {
      color: var(--accent);

      svg {
        transform: translateX(4px);
      }
    }
  }

  .tool-index {
    font-family: $font-mono;
    font-size: 11.5px;
    letter-spacing: 2px;
    color: $accent-2;
  }

  .tool-name {
    font-size: 17px;
    font-weight: 600;
    color: $ink;
  }

  .tool-desc {
    flex: 1;
    font-size: 13.5px;
    line-height: 1.7;
    color: $ink-2;
  }

  .tool-enter {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    margin-top: 4px;
    font-family: $font-mono;
    font-size: 12px;
    letter-spacing: 1px;
    color: $accent-2;
    transition: color 0.22s ease;

    svg {
      width: 15px;
      height: 15px;
      transition: transform 0.22s ease;
    }
  }
}
</style>
