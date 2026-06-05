<template>
  <div class="content-card mica-card">
    <h2>找不到网页</h2>
    <p>找不到你想要的网页，或许我还没开始做这个页面。<router-link to="/" class="not-found-link">返回主页</router-link>试试？</p>
  </div>
</template>

<style scoped>
.not-found-link {
  text-decoration: none;
  color: #1f6d8a;
  border-bottom: 1px dotted #6f9fb3;
}
</style>