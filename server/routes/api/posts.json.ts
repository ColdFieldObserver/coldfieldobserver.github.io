import { queryCollection } from '@nuxt/content/server';
import { byDateDesc, toBasePost } from '#shared/utils/post';

// 轻量文章列表（不含正文）：列表页、侧栏「最新动态」、上下篇共用。
// 该路由会被预渲染成静态文件，客户端导航直接复用，不依赖内容库运行时。
export default defineEventHandler(async (event) => {
  const docs = await queryCollection(event, 'posts').all();
  return docs.map((doc) => toBasePost(doc as never)).sort(byDateDesc);
});
