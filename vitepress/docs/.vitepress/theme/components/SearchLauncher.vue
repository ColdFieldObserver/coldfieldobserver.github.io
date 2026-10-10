<script setup lang="ts">
import { openSearchDialog } from '@/composables/useSearch';
</script>

<template>
  <button class="search-launcher" type="button" aria-haspopup="dialog" @click="openSearchDialog($event.currentTarget as HTMLElement)">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
    <span>检索日志标题、正文与标签…</span>
    <kbd>Ctrl K</kbd>
  </button>
</template>

<style scoped lang="scss">
@use '../styles/variables' as *;
@use '../styles/mixins' as *;

.search-launcher {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  margin: 0 0 18px;
  padding: 11px 18px;
  font: inherit;
  font-size: 14.5px;
  text-align: left;
  color: $ink-3;
  background: $card;
  border: 1px solid $line;
  border-left: 2px solid var(--accent);
  transition: border-color 0.22s ease, box-shadow 0.22s ease, color 0.22s ease;
  @include focus-ring;

  svg {
    flex: 0 0 18px;
    width: 18px;
    height: 18px;
  }

  span {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  kbd {
    flex: 0 0 auto;
    padding: 2px 7px;
    font-family: $font-mono;
    font-size: 11px;
    color: $ink-3;
    background: $panel;
    border: 1px solid $line;
    border-radius: 2px;
  }

  &:hover,
  &:focus-visible {
    color: $ink;
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--accent-soft);
    outline: none;
  }
}
</style>
