<script setup lang="ts">
// ============================================================
// 全站壳层（骨架阶段）
//   .site-main 是全站唯一纵向滚动容器，body 不滚动（见 router.options.ts）。
//   侧栏 / 搜索弹窗等在后续提交里补齐。
// ============================================================
</script>

<template>
  <main id="content" class="site-main" role="main">
    <slot />
  </main>
</template>
