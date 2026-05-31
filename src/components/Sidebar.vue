<template>
  <aside class="sidebar">
    <SidebarBlock title="个人档案">
      <ul>
        <li>兴趣爱好：打游戏、听音乐、看视频、户外散步、偶尔写点东西</li>
        <li>喜欢玩的游戏：逃跑吧少年、蛋仔派对、我的世界、植物大战僵尸2、保卫萝卜4、光遇</li>
        <li>主阵地：逃少音乐档案馆 (B站 & WP独立站)</li>
      </ul>
    </SidebarBlock>

    <SidebarBlock title="友情链接">
      <div class="link-list">
        <ul>
          <li><a href="https://space.bilibili.com/3632301571311734" target="_blank">逃少音乐档案馆（B站）</a></li>
          <li><a href="https://dmmdzzmusicarchive.wordpress.com/" target="_blank">逃少音乐档案馆（WP）</a></li>
          <li><a href="https://space.bilibili.com/3706982592678629" target="_blank">冷域观者的B站个人空间</a></li>
          <li><a href="https://coldfieldobserver.mysxl.cn/" target="_blank">冷域观者的博客（上线了）</a></li>
          <li><a href="https://alonewalkman.wordpress.com/" target="_blank">冷域观者的博客（WordPress）</a></li>
          <li><a href="https://github.com/ColdFieldObserver" target="_blank">冷域观者的GitHub（ColdFieldObserver）</a></li>
          <li><a href="https://alonevoyager.github.io/" target="_blank">Alone Voyager的GitHub Pages</a></li>
          <li><a href="https://danxiaolan.wordpress.com/" target="_blank">蛋小蓝的博客（建设中）</a></li>
        </ul>
        <p style="margin-top: 0.8rem; font-size:0.8rem;">部分链接可能会失效，我如果有时间会及时更新的。</p>
      </div>
    </SidebarBlock>

    <SidebarBlock title="工具">
      <div class="link-list">
        <ul>
          <li><router-link to="/tools/base64">Base64编解码工具</router-link></li>
          <li><router-link to="/tools/unicode">Unicode编解码工具</router-link></li>
          <li><router-link to="/tools/timestamp">时间戳转换工具</router-link></li>
          <li><router-link to="/tools/url">URL编码/解码工具</router-link></li>
          <li>更多工具敬请期待...</li>
        </ul>
      </div>
    </SidebarBlock>

    <SidebarBlock title="公告">
      <p>2026年5月13日：更换B站账号。</p>
      <p>2026年5月3日：个人博客迎来重大更新。</p>
    </SidebarBlock>
  </aside>
</template>

<script setup>
import SidebarBlock from './SidebarBlock.vue'
</script>

<style scoped>
.sidebar {
  flex: 1.2;
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
}

.link-list a {
  text-decoration: none;
  color: #1f6d8a;
  border-bottom: 1px dotted #6f9fb3;
}

.link-list a:hover {
  color: #043b4b;
  border-bottom-style: solid;
}

@media (max-width: 880px) {
  .sidebar {
    order: 2;
    flex-direction: column;
    margin-top: 1rem;
  }
}
</style>