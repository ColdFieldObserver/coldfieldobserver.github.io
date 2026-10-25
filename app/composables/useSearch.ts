import { ref } from 'vue';

// ============================================================
// 全站共享的搜索状态
//   搜索弹窗与 /search/ 直达页共用同一份关键词与开关，
//   地址栏 ?q= 用 replaceState 同步（不产生历史、不触发路由）。
// ============================================================

export const searchKeyword = ref('');
export const searchDialogOpen = ref(false);

let searchDialogOpener: HTMLElement | null = null;

export function openSearchDialog(opener?: HTMLElement): void {
  if (!searchDialogOpen.value && typeof document !== 'undefined') {
    searchDialogOpener =
      opener ?? (document.activeElement instanceof HTMLElement ? document.activeElement : null);
  }
  searchDialogOpen.value = true;
}

export function closeSearchDialog(): void {
  searchDialogOpen.value = false;
}

export function clearSearchKeyword(): void {
  searchKeyword.value = '';
  writeKeywordToUrl();
}

/** 关闭弹窗后把焦点还给触发元素 */
export function restoreSearchDialogFocus(): void {
  const opener = searchDialogOpener;
  searchDialogOpener = null;
  if (opener?.isConnected) opener.focus({ preventScroll: true });
}

/** 从地址栏 ?q= 同步关键词（仅浏览器端生效） */
export function syncKeywordFromUrl(): void {
  if (typeof window === 'undefined') return;
  searchKeyword.value = new URLSearchParams(window.location.search).get('q') ?? '';
}

/** 把关键词写回地址栏 ?q=（replaceState，不跳转、不失焦） */
export function writeKeywordToUrl(): void {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  const q = searchKeyword.value.trim();
  if (q) url.searchParams.set('q', q);
  else url.searchParams.delete('q');
  window.history.replaceState(null, '', url);
}
