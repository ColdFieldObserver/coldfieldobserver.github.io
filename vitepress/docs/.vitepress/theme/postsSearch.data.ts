import { createContentLoader } from 'vitepress';
import type { Post } from './types';
import { byDateDesc, stripHtml, toBasePost } from './postMap';

/**
 * 全文检索语料加载器（**含纯文本正文**，截断至 CONTENT_LIMIT 字）。
 * 只有搜索需要它，体积明显大于轻量数据，因此由搜索组件动态按需加载。
 */
declare const data: Post[];
export { data };

/** 单篇正文截断长度（本地检索够用，避免语料过大） */
const CONTENT_LIMIT = 3000;

export default createContentLoader('posts/*.md', {
  render: true,
  transform(raw): Post[] {
    return raw
      .map((page) => ({
        ...toBasePost(page),
        content: stripHtml(page.html ?? '').slice(0, CONTENT_LIMIT),
      }))
      .sort(byDateDesc);
  },
});
