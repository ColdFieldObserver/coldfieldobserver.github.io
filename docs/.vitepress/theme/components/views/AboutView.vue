<script setup lang="ts">
import { withBase } from 'vitepress';
import { SOCIAL_LINKS, SITE } from '@/config';

// ============================================================
// 关于页
//   正文 = docs/about.md（占位内容），渲染在 .post-content 内以复用完整 Markdown 样式
//   版权信息 = 原项目页脚（footer-note），按要求迁移到本页面
// ============================================================

const COPYRIGHT = [
  { label: '版权所有者', value: SITE.author },
  { label: '版权期限', value: '2022 - 2026' },
  { label: '托管平台', value: 'GitHub Pages' },
  { label: '开源协议', value: 'MIT License' },
];
</script>

<template>
  <div class="about-view">
    <!-- 正文占位：about.md -->
    <article class="about-doc">
      <div class="post-content"><Content /></div>
    </article>

    <!-- 版权信息（原项目页脚） -->
    <section class="about-layout">
      <div class="copyright">
        <h2 class="mecha-title">版权与声明</h2>

        <div class="copyright-grid">
          <div v-for="item in COPYRIGHT" :key="item.label" class="copyright-row">
            <span class="copyright-label">{{ item.label }}</span>
            <span class="copyright-value">{{ item.value }}</span>
          </div>
        </div>

        <p class="copyright-note">
          本网站由 GitHub Pages 托管，网站的源代码在
          <a href="https://github.com/ColdFieldObserver/coldfieldobserver.github.io" target="_blank" rel="noopener">
            GitHub 仓库
          </a>。
        </p>
        <p class="copyright-note">2022-2026 冷域观者 / ColdFieldObserver · 保留所有权利。</p>
      </div>

      <aside class="link-map">
        <h2 class="mecha-title">外部端点</h2>
        <ul>
          <li v-for="link in SOCIAL_LINKS" :key="link.href">
            <a :href="link.href" target="_blank" rel="noopener">{{ link.label }}</a>
          </li>
          <li><a :href="withBase('/atom.xml')">RSS 订阅（Atom）</a></li>
        </ul>
      </aside>
    </section>
  </div>
</template>

<style scoped lang="scss">
@use '../../styles/variables' as *;
@use '../../styles/mixins' as *;

.about-view {
  max-width: 960px;
  margin: 0 auto;
}

.about-doc {
  padding: 28px 32px 30px;
  background: $card;
  border: 1px solid $line;
  border-top: 2px solid var(--accent);
  clip-path: mecha-clip($cut-l);
  box-shadow: $shadow-card;

  @include respond-below($bp-xs) {
    padding: 20px 16px 22px;
  }
}

.about-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr);
  gap: 20px;
  margin-top: 26px;

  @include respond-below($bp-md) {
    grid-template-columns: 1fr;
  }
}

.copyright,
.link-map {
  padding: 20px 22px 22px;
  background: $panel;
  border: 1px solid $line;
  clip-path: mecha-clip($cut-m);
}

.copyright-grid {
  margin-top: 16px;
}

.copyright-row {
  display: flex;
  align-items: baseline;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px dashed $line;

  &:last-child {
    border-bottom: none;
  }
}

.copyright-label {
  flex: 0 0 92px;
  font-family: $font-mono;
  font-size: 11.5px;
  letter-spacing: 1px;
  color: $ink-3;
}

.copyright-value {
  font-size: 14.5px;
  font-weight: 600;
  color: $ink;
}

.copyright-note {
  margin-top: 12px;
  font-size: 13.5px;
  line-height: 1.75;
  color: $ink-2;

  a {
    color: $accent-2;
    text-decoration: underline;
    text-underline-offset: 2px;

    &:hover {
      color: var(--accent);
    }
  }
}

.link-map {
  ul {
    margin-top: 16px;
    list-style: none;
  }

  li {
    border-bottom: 1px dashed $line;

    &:last-child {
      border-bottom: none;
    }
  }

  a {
    display: block;
    padding: 7px 0;
    font-size: 13.8px;
    color: $ink-2;
    transition: color 0.22s ease, padding-left 0.22s ease;
    @include clamp-lines(2);

    &:hover {
      color: var(--accent);
      padding-left: 5px;
    }
  }
}
</style>
