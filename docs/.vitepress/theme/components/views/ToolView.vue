<script setup lang="ts">
import { computed } from 'vue';
import { useData, withBase } from 'vitepress';
import { TOOL_LINKS } from '@/config';
import Base64Tool from '../tools/Base64Tool.vue';
import UnicodeTool from '../tools/UnicodeTool.vue';
import TimestampTool from '../tools/TimestampTool.vue';
import UrlTool from '../tools/UrlTool.vue';
import EggyPartyMapTextTool from '../tools/EggyPartyMapTextTool.vue';

// ============================================================
// 单个工具页：按 frontmatter.tool 分派到对应组件
//   新增工具 = 在 config.ts 的 TOOL_LINKS 加一项 + 这里注册组件 + 建一个 md
// ============================================================
const { frontmatter } = useData();

const REGISTRY: Record<string, unknown> = {
  base64: Base64Tool,
  unicode: UnicodeTool,
  timestamp: TimestampTool,
  url: UrlTool,
  'eggyparty-map-text': EggyPartyMapTextTool,
};

const slug = computed(() => String(frontmatter.value.tool ?? ''));
const component = computed(() => REGISTRY[slug.value]);
const meta = computed(() => TOOL_LINKS.find((item) => item.slug === slug.value));
</script>

<template>
  <section class="tool-page">
    <a class="tool-back" :href="withBase('/tools/')">← 返回工具矩阵</a>

    <header v-if="meta" class="tool-head">
      <h1>{{ meta.name }}</h1>
      <p>{{ meta.desc }}</p>
    </header>

    <component :is="component" v-if="component" />

    <div v-else class="info-block">
      <h2>模块缺失</h2>
      <p>未找到名为 <code>{{ slug }}</code> 的工具模块。</p>
    </div>
  </section>
</template>

<style scoped lang="scss">
@use '../../styles/variables' as *;

.tool-page {
  max-width: $max-w;
  margin: 0 auto;
}

.info-block code {
  font-family: $font-mono;
  font-size: 13px;
  padding: 1px 6px;
  color: var(--inline-code-ink);
  background: var(--inline-code-bg);
  border-radius: 2px;
}
</style>
