<script setup lang="ts">
import { ref } from 'vue';
import ToolResult from './ToolResult.vue';

// ============================================================
// 蛋仔派对地图文本处理
//   逻辑移植自 StarLight-7693.github.io.react 的 useEggyPartyMapTextProcessor，
//   把游戏内「复制分享文本」整理成标准分享文案 / 短视频文案。
// ============================================================

const EXAMPLE = '复制打开【蛋仔派对】，游玩地图《此图菜鸟都能过！》，地图码6040-1745。';

const input = ref('');
const result = ref('');
const status = ref<'idle' | 'success' | 'error'>('idle');

function extractMapName(text: string): string {
  const match = text.match(/《([^》]+)》/);
  if (match && match[1]) return match[1].trim();
  throw new Error('未找到地图名（未匹配到《地图名》）');
}

function extractMapCode(text: string): string {
  let match = text.match(/地图码(\d+[-]?\d+)/);
  if (match && match[1]) return match[1].trim();
  match = text.match(/(\d{4,}-\d+)/);
  if (match && match[1]) return match[1];
  throw new Error('未找到地图码');
}

const EXTRA_MESSAGES = [
  '长按复制这段内容，打开蛋仔派对，玩视频内同款地图~',
  '想体验这张超好玩的地图吗？长按复制这段内容，打开蛋仔派对就可以了~',
  '小蛋仔，想要体验这张地图吗？只需要长按复制这段内容，然后打开蛋仔派对就能玩喽~',
  '想要挑战自己的极限吗？长按复制这段内容，打开蛋仔派对，开启你的冒险之旅吧~',
  '想要和你的蛋搭子一起玩这张地图？没问题！长按复制这段内容，打开蛋仔派对，然后约上你的蛋搭子和你一起玩就可以了~',
  '想要检验自己的技术实力吗？长按复制这段内容，打开蛋仔派对，来挑战这张地图吧~',
  '这张地图太难了，希望你能来挑战一下！长按复制这段内容，打开蛋仔派对，来试试你的技术吧~',
  '这张地图太好玩了，你也来试试吧！长按复制这段内容，打开蛋仔派对，来体验一下吧~',
  '如果你觉得不开心的话，不妨来玩一下这张地图吧！长按复制这段内容，打开蛋仔派对，撞走不开心~',
  '还在为找不到好玩的地图而发愁吗？那么你一定要来玩玩这张地图！长按复制这段内容，打开蛋仔派对，一起来玩吧~',
];

const SHORT_VIDEO_PREFIXES = [
  '快来快来！我发现了一张超好玩的地图',
  '挖到宝藏蛋仔地图啦',
  '被这张蛋仔地图狠狠拿捏住了',
  '蛋仔必玩宝藏地图分享',
  '谁还没玩过这张神仙蛋仔地图',
  '安利一款超有意思的蛋仔闯关图',
  '蛋仔地图推荐｜亲测好玩不踩雷',
  '闲得无聊？试试这张蛋仔地图',
  '蛋搭子速来集合！优质地图奉上',
  '近期玩过体验感拉满的蛋仔地图',
];

const TAG_POOL = [
  '蛋仔派对_',
  '蛋仔日常',
  '蛋仔派对地图打卡',
  '蛋仔宝藏地图',
  '蛋仔地图推荐',
  '蛋仔奇思妙想计划',
  '蛋仔旅行家',
  '蛋仔带你看世界',
  '蛋仔派对创计划',
  '可爱蛋仔',
];

function pick<T>(list: readonly T[]): T {
  return list[Math.floor(Math.random() * list.length)];
}

function extraInformation(): string {
  return pick(EXTRA_MESSAGES);
}

function shortVideoPrefix(): string {
  return pick(SHORT_VIDEO_PREFIXES);
}

/** 随机抽 3 个不重复标签 */
function randomTags(): string {
  const shuffled = [...TAG_POOL].sort(() => Math.random() - 0.5);
  return shuffled
    .slice(0, 3)
    .map((tag) => `#${tag}`)
    .join(' ');
}

function generateOutput(mapName: string, mapCode: string, shortVideoMode: boolean): string {
  if (shortVideoMode) {
    return `${shortVideoPrefix()}《${mapName}》，地图码是${mapCode}。${extraInformation()} #蛋仔派对 ${randomTags()}`;
  }
  return [
    `【蛋仔派对】地图《${mapName}》试玩`,
    '',
    '相关游戏：蛋仔派对',
    `地图名：${mapName}`,
    `地图码：${mapCode}`,
    extraInformation(),
    '(ColdFieldObserver Website Generate)',
  ].join('\n');
}

function process(shortVideoMode = false): void {
  const text = input.value.trim();
  if (!text) {
    result.value = '请输入要处理的文本';
    status.value = 'error';
    return;
  }
  try {
    const mapName = extractMapName(text);
    const mapCode = extractMapCode(text);
    result.value = generateOutput(mapName, mapCode, shortVideoMode);
    status.value = 'success';
  } catch (error) {
    result.value = (error as Error).message;
    status.value = 'error';
  }
}

function loadExample(): void {
  input.value = EXAMPLE;
}

function clear(): void {
  input.value = '';
  result.value = '';
  status.value = 'idle';
}
</script>

<template>
  <div class="tool-view">
    <div class="field">
      <label class="field-label" for="eggy-input">粘贴分享文本</label>
      <textarea
        id="eggy-input"
        v-model="input"
        class="mecha-textarea"
        :placeholder="EXAMPLE"
        rows="4"
      />
    </div>

    <div class="btn-row">
      <button type="button" class="mecha-btn primary" @click="process(false)">处理文本</button>
      <button type="button" class="mecha-btn" @click="process(true)">生成短视频文案</button>
      <button type="button" class="mecha-btn" @click="loadExample">加载示例</button>
      <button type="button" class="mecha-btn" @click="clear">清空</button>
    </div>

    <ToolResult :result="result" :status="status" />

    <div class="info-block">
      <h2>使用示例</h2>
      <p><strong>输入格式：</strong></p>
      <pre>复制打开【蛋仔派对】，游玩地图《此图菜鸟都能过！》，地图码6040-1745。</pre>
      <p><strong>输出结果：</strong></p>
      <pre>【蛋仔派对】地图《此图菜鸟都能过！》试玩

相关游戏：蛋仔派对
地图名：此图菜鸟都能过！
地图码：6040-1745
想要检验自己的技术实力吗？长按复制这段内容，打开蛋仔派对，来挑战这张地图吧~
(ColdFieldObserver Website Generate)</pre>
    </div>
  </div>
</template>
