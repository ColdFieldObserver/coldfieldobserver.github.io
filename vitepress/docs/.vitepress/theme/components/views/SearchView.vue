<script setup lang="ts">
import SearchResults from '../SearchResults.vue';
import SearchBox from '../SearchBox.vue';
</script>

<template>
  <div class="search-view">
    <!-- 搜索框置于标题之上（搜索页独有布局） -->
    <SearchBox autofocus />

    <h1 class="list-title">全站检索</h1>

    <SearchResults />
  </div>
</template>

<style scoped lang="scss">
@use '../../styles/variables' as *;

.search-view {
  max-width: 1000px;
  margin: 0 auto;
}

// 搜索页标题紧跟搜索框
.list-title {
  position: relative;
  padding-left: 12px;
  font-size: clamp(22px, 3.4vw, 30px);
  font-weight: 700;
  letter-spacing: 1px;
  color: $ink;

  &::before {
    content: '';
    position: absolute;
    top: 0.24em;
    bottom: 0.24em;
    left: 0;
    width: 4px;
    background: linear-gradient(135deg, #2d8cff 0%, #1a5fa0 100%);
  }
}
</style>
