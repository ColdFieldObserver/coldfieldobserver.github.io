<script setup lang="ts">
import { withBase } from 'vitepress';
</script>

<template>
  <div class="not-found">
    <p class="code">404</p>
    <h1>信号丢失</h1>
    <p class="desc">你访问的坐标不存在，或者已经被迁移到别的位置。</p>
    <div class="actions">
      <a class="mecha-btn primary" :href="withBase('/')">返回首页</a>
      <a class="mecha-btn" :href="withBase('/posts/')">浏览日志</a>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '../../styles/variables' as *;

.not-found {
  max-width: 540px;
  margin: 8vh auto 0;
  padding: 44px 32px 40px;
  text-align: center;
  background: $card;
  border: 1px solid $line;
  border-top: 2px solid var(--accent);
  clip-path: polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%);

  .code {
    font-family: $font-mono;
    font-size: 66px;
    font-weight: 800;
    line-height: 1;
    letter-spacing: 4px;
    color: var(--accent);
  }

  h1 {
    margin: 14px 0 8px;
    font-size: 22px;
    letter-spacing: 1px;
    color: $ink;
  }

  .desc {
    margin-bottom: 26px;
    font-size: 14.5px;
    color: $ink-2;
  }

  .actions {
    display: flex;
    gap: 12px;
    justify-content: center;
    flex-wrap: wrap;
  }
}
</style>
