import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
  },
  {
    path: '/tools',
    name: 'tools',
    component: () => import('../views/ToolsView.vue'),
  },
  {
    path: '/tools/base64',
    name: 'base64',
    component: () => import('../views/tools/Base64Tool.vue'),
  },
  {
    path: '/tools/unicode',
    name: 'unicode',
    component: () => import('../views/tools/UnicodeTool.vue'),
  },
  {
    path: '/tools/url',
    name: 'url',
    component: () => import('../views/tools/UrlTool.vue'),
  },
  {
    path: '/tools/timestamp',
    name: 'timestamp',
    component: () => import('../views/tools/TimestampTool.vue'),
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFoundView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory('/'),
  routes,
})

export default router