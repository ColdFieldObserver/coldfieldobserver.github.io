import { countPosts, paginationParams } from '../../.vitepress/build/posts';

/**
 * 日志列表分页动态路由。
 * 第 1 页为 /posts/（docs/blog/index.md 经 rewrites 映射），
 * 此处生成 /posts/page/2.html、/posts/page/3.html …
 */
export default {
  watch: ['../../posts/*.md'],
  paths() {
    return paginationParams(countPosts());
  },
};
