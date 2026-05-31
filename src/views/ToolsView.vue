<template>
  <div class="content-card mica-card">
    <h2>工具列表</h2>
    <p>这里提供了一些实用的在线工具，方便日常使用。</p>

    <div class="tools-grid">
      <div class="tool-card mica-card">
        <h3>Base64编解码工具</h3>
        <p>支持文本与Base64编码之间的相互转换</p>
        <router-link to="/tools/base64" class="btn btn-primary">使用工具</router-link>
      </div>

      <div class="tool-card mica-card">
        <h3>Unicode编解码工具</h3>
        <p>支持文本与Unicode码点之间的相互转换</p>
        <router-link to="/tools/unicode" class="btn btn-primary">使用工具</router-link>
      </div>

      <div class="tool-card mica-card">
        <h3>时间戳转换工具</h3>
        <p>支持时间戳与日期时间之间的相互转换</p>
        <router-link to="/tools/timestamp" class="btn btn-primary">使用工具</router-link>
      </div>

      <div class="tool-card mica-card">
        <h3>URL编解码工具</h3>
        <p>支持URL字符串的编码和解码操作</p>
        <router-link to="/tools/url" class="btn btn-primary">使用工具</router-link>
      </div>
    </div>

    <p class="tail-note">更多工具正在开发中...</p>
  </div>
</template>

<style scoped>
.tail-note {
  margin-top: 2rem;
  font-size: 0.9rem;
  color: #4a7a8a;
}
</style>