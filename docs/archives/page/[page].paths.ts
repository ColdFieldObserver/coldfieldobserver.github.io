import { countPosts, paginationParams } from '../../.vitepress/build/posts';

/**
 * 归档分页动态路由：第 1 页为 /archives/，此处生成第 2..N 页。
 */
export default {
  watch: ['../../posts/*.md'],
  paths() {
    return paginationParams(countPosts());
  },
};
