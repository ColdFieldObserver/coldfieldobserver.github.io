<template>
  <div id="app-root">
    <NavBar />
    <div class="main-grid">
      <main class="content-area">
        <router-view />
      </main>
      <Sidebar v-if="showSidebar" />
    </div>
    <AppFooter />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from './components/NavBar.vue'
import Sidebar from './components/Sidebar.vue'
import AppFooter from './components/AppFooter.vue'

const route = useRoute()
const showSidebar = computed(() => route.name !== 'not-found')
</script>