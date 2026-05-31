<template>
  <nav class="navbar mica-card">
    <div class="logo">
      <h1>冷域观者的个人网站</h1>
    </div>
    <div class="nav-links">
      <router-link to="/">主页</router-link>
      <router-link to="/tools">工具</router-link>
      <router-link to="/about">关于</router-link>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  max-width: 1300px;
  margin: 0 auto 2rem auto;
  padding: 0.85rem 2rem;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
}

.logo h1 {
  font-family: '微软雅黑', 'Segoe UI', '宋体', 'SimSun', Tahoma, Geneva, Verdana, system-ui, sans-serif;
  font-weight: 500;
  font-size: 1.7rem;
  letter-spacing: -0.3px;
  color: #1e2f3a;
  text-shadow: 0 1px 1px rgba(255,255,255,0.3);
}

.nav-links {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.nav-links a {
  text-decoration: none;
  font-weight: 500;
  color: #1f3e4b;
  font-size: 1rem;
  transition: 0.2s;
  padding: 0.3rem 0;
  border-bottom: 2px solid transparent;
}

.nav-links a:hover {
  border-bottom-color: #2c6e8f;
  color: #0b2b38;
}

@media (max-width: 880px) {
  .navbar {
    flex-direction: column;
    align-items: flex-start;
    padding: 1rem 1.4rem;
  }
  .nav-links {
    width: 100%;
    justify-content: flex-start;
    gap: 1.5rem;
  }
}

@media (max-width: 520px) {
  .navbar {
    padding: 0.8rem 1rem;
  }
}
</style>