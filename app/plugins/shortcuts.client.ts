import { openSearchDialog, searchDialogOpen } from '~/composables/useSearch';

// ============================================================
// 全站快捷键
// ------------------------------------------------------------
// 「/」打开搜索：全站唯一入口，不依赖当前页是否放了搜索框。
// 不劫持的情况：
//   - 已按着 Ctrl / Cmd / Alt（避免撞浏览器快捷键）
//   - 输入法组合中（isComposing）
//   - 焦点已在输入框 / 文本域 / select / contentEditable 里（正常打字）
// 弹窗打开后由 NewsSearchBox 的 autofocus 接管焦点。
// ============================================================

function isEditable(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
}

export default defineNuxtPlugin(() => {
  function onKeydown(event: KeyboardEvent): void {
    const isSlash = event.key === '/';
    const isCmdK = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k';
    if (!isSlash && !isCmdK) return;
    if (event.ctrlKey || event.metaKey || event.altKey) {
      if (!isCmdK) return;
    }
    if (event.isComposing || isEditable(event.target)) return;
    event.preventDefault();
    if (!searchDialogOpen.value) openSearchDialog();
  }

  document.addEventListener('keydown', onKeydown);
});
