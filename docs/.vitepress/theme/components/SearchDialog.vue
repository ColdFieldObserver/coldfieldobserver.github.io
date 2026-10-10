<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue';
import SearchBox from './SearchBox.vue';
import SearchResults from './SearchResults.vue';
import {
  clearSearchKeyword,
  closeSearchDialog,
  restoreSearchDialogFocus,
  searchDialogOpen,
} from '@/composables/useSearch';

const dialog = ref<HTMLDialogElement | null>(null);
const contentVisible = ref(false);
let contentTimer: number | undefined;

function finishClose(): void {
  if (contentTimer !== undefined) window.clearTimeout(contentTimer);
  contentTimer = undefined;
  if (searchDialogOpen.value) return;
  contentVisible.value = false;
  clearSearchKeyword();
}

watch(searchDialogOpen, async (open) => {
  await nextTick();
  const element = dialog.value;
  if (!element || open !== searchDialogOpen.value) return;

  if (open) {
    if (contentTimer !== undefined) window.clearTimeout(contentTimer);
    contentTimer = undefined;
    contentVisible.value = true;
    await nextTick();
    if (!searchDialogOpen.value) return;
    if (!element.open) element.showModal();
    element.querySelector<HTMLInputElement>('input[type="search"]')?.focus({ preventScroll: true });
  } else {
    if (element.open) element.close();
    restoreSearchDialogFocus();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finishClose();
    } else {
      contentTimer = window.setTimeout(finishClose, 320);
    }
  }
});

function onDialogClick(event: MouseEvent): void {
  if (event.target === event.currentTarget) closeSearchDialog();
}

function onResultClick(event: MouseEvent): void {
  if (event.target instanceof Element && event.target.closest('a.post-card')) {
    closeSearchDialog();
  }
}

function onDialogTransitionEnd(event: TransitionEvent): void {
  if (event.target === dialog.value && event.propertyName === 'opacity' && !dialog.value?.open) {
    finishClose();
  }
}

onBeforeUnmount(() => {
  if (dialog.value?.open) dialog.value.close();
  if (contentTimer !== undefined) window.clearTimeout(contentTimer);
  restoreSearchDialogFocus();
});
</script>

<template>
  <dialog
    ref="dialog"
    class="search-dialog"
    aria-labelledby="search-dialog-title"
    @click="onDialogClick"
    @transitionend="onDialogTransitionEnd"
    @cancel.prevent="closeSearchDialog"
  >
    <template v-if="contentVisible">
      <header class="search-dialog-header">
        <h2 id="search-dialog-title">
          <span class="dot" aria-hidden="true" />
          全站检索
        </h2>
        <button class="search-dialog-close" type="button" aria-label="关闭搜索" @click="closeSearchDialog">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </header>
      <SearchBox autofocus />
      <div class="search-dialog-results" @click="onResultClick">
        <SearchResults />
      </div>
    </template>
  </dialog>
</template>

<style scoped lang="scss">
@use '../styles/variables' as *;
@use '../styles/mixins' as *;

.search-dialog {
  position: fixed;
  display: none;
  inset: 0;
  width: min(920px, calc(100vw - 32px));
  max-width: none;
  max-height: min(86vh, 880px);
  margin: auto;
  padding: 24px;
  overflow-y: auto;
  color: $ink;
  background: $card;
  border: 1px solid $line;
  border-top: 2px solid var(--accent);
  clip-path: mecha-clip(20px);
  box-shadow: $shadow-float;
  opacity: 0;
  transform: translateY(12px);
  transition:
    opacity 0.24s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.24s cubic-bezier(0.22, 1, 0.36, 1),
    display 0.24s allow-discrete,
    overlay 0.24s allow-discrete;

  &[open] {
    display: block;
    opacity: 1;
    transform: none;
  }

  &::backdrop {
    background: var(--overlay);
    backdrop-filter: blur(3px);
  }
}

@starting-style {
  .search-dialog[open] {
    opacity: 0;
    transform: translateY(12px);
  }
}

.search-dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;

  h2 {
    display: flex;
    align-items: center;
    gap: 9px;
    font-size: 20px;
    font-weight: 700;
    letter-spacing: 1px;
  }

  .dot {
    width: 8px;
    height: 8px;
    background: var(--accent);
    clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  }
}

.search-dialog-close {
  display: grid;
  flex: 0 0 38px;
  width: 38px;
  height: 38px;
  place-items: center;
  color: $ink-2;
  border: 1px solid $line;
  clip-path: mecha-clip-dual(8px);
  transition: color 0.2s ease, background 0.2s ease, border-color 0.2s ease;

  svg {
    width: 18px;
    height: 18px;
  }

  &:hover,
  &:focus-visible {
    color: var(--on-accent);
    background: var(--accent);
    border-color: var(--accent);
    outline: none;
  }
}

.search-dialog-results {
  margin-top: 4px;
}

@media (max-width: 640px) {
  .search-dialog {
    width: calc(100vw - 20px);
    max-height: 90vh;
    padding: 18px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .search-dialog,
  .search-dialog::backdrop {
    transition: none;
  }
}
</style>
