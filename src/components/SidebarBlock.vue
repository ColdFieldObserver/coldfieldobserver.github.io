<template>
  <div class="sidebar-block mica-card">
    <h3>{{ title }}</h3>
    <slot />
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
})
</script>

<style scoped>
.sidebar-block {
  padding: 1.5rem 1.6rem;
  border-radius: 28px;
}

.sidebar-block h3 {
  font-family: '微软雅黑', 'Segoe UI', '宋体', 'SimSun', Tahoma, Geneva, Verdana, system-ui, sans-serif;
  font-weight: 600;
  font-size: 1.35rem;
  margin-bottom: 1rem;
  color: #1a3a48;
  border-left: 4px solid #287a9e;
  padding-left: 12px;
}

.sidebar-block ul,
.sidebar-block p {
  font-size: 0.9rem;
  line-height: 1.5;
  color: #1e3a44;
}

.sidebar-block li {
  margin-bottom: 0.6rem;
  list-style-type: none;
  display: flex;
  align-items: center;
  gap: 8px;
}

.sidebar-block li::before {
  content: "✦";
  color: #3e7b99;
  font-size: 0.8rem;
}

@media (max-width: 880px) {
  .sidebar-block {
    padding: 1.2rem;
  }
}
</style>