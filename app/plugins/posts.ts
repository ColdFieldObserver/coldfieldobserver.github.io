// ============================================================
// 文章列表预取
//
// 侧栏「最新动态」与各列表页共用同一份 useState('posts:all')。
// 放在 plugin 而不是 layout 的 setup 里：plugin 在应用创建阶段执行，
// SSR 时数据先就位，首屏 HTML 就有内容；layout 不在 <Suspense> 内，
// 顶层 await 会让客户端 hydration 挂起（页面卡死）。
// 客户端 hydration 时状态已在 payload 里，不会重复请求。
// ============================================================
export default defineNuxtPlugin(async () => {
  try {
    await fetchAllPosts();
  } catch {
    // 接口不可用（例如离线开发）时降级为空列表，不阻塞应用启动
  }
});
