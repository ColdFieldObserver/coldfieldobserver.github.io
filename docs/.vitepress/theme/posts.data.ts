import { createContentLoader } from 'vitepress';
import type { Post } from './types';
import { byDateDesc, toBasePost } from './postMap';

/**
 * 轻量文章数据加载器（**不含正文**）。
 *
 * 列表 / 归档 / 分类 / 标签 / 侧栏 / 上下篇都消费这份数据。
 * 不做 Markdown 渲染（不开 render），构建更快，也避免把整站正文塞进
 * 「每个页面都会下载」的公共 chunk。需要正文的全文检索见 postsSearch.data.ts。
 */
declare const data: Post[];
export { data };

export default createContentLoader('posts/*.md', {
  transform(raw): Post[] {
    return raw.map(toBasePost).sort(byDateDesc);
  },
});
