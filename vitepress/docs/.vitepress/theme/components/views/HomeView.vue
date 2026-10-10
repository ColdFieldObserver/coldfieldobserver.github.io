<script setup lang="ts">
import { withBase } from 'vitepress';

// ============================================================
// 首页：内容取自原项目 index.html，按机甲版式重排
//   驾驶舱概览 → 站点模块 → 蛋仔派对 ID → 站点说明
// ============================================================

const PROFILE = [
  { label: '兴趣爱好', value: '打游戏、听音乐、看视频、户外散步、偶尔写点东西' },
  { label: '常玩游戏', value: '逃跑吧少年、蛋仔派对、我的世界、植物大战僵尸2、保卫萝卜4、光遇' },
  { label: '主阵地', value: '逃少音乐档案馆（B站 & WP独立站）' },
  { label: '技术栈', value: 'C、C++、C#、Python、HTML、CSS、JavaScript' },
];

const EGGY_IDS = [
  { file: 'eggypartyid.jpg', name: '实况主灯塔', note: '大号' },
  { file: 'eggypartyid2.jpg', name: '翌测', note: '小号' },
];

const MODULES = [
  { label: '日志终端', desc: '按时间归档的全部记录', href: '/archives/', code: 'ARCHIVE' },
  { label: '工具矩阵', desc: 'Base64 / Unicode / 时间戳 / URL', href: '/tools/', code: 'TOOLS' },
  { label: 'RSS 订阅', desc: '用阅读器跟踪更新', href: '/atom.xml', code: 'FEED' },
];
</script>

<template>
  <div class="home-view">
    <!-- 驾驶舱概览 -->
    <section class="hero">
      <div class="hero-body">
        <p class="hero-kicker">// COLDFIELD OBSERVER · PERSONAL TERMINAL</p>
        <h1 class="hero-title">欢迎来到冷域观者的个人网站！</h1>
        <p class="hero-desc">
          我是冷域观者，一个逃跑吧少年和蛋仔派对玩家，偶尔也玩我的世界、PVZ2
          和保卫萝卜4，同时还是逃少音乐档案馆的主理人。
        </p>
        <p class="hero-desc">
          曾用名 AsyncObserver、蛋仔派对远航蛋、主唱耀星_Eggy、UNI-航行的灯塔、TP-RLX-LIGHT
          等，喜欢数码和技术。我也接触过编程，C、C++、C#、Python、HTML、CSS、JavaScript
          都懂一点，有时候也会试着用别的语言重构几个易语言项目玩玩（易语言的缺点你们懂的）。
        </p>
        <p class="hero-desc">这里是我的个人网站。当然我不在这里发博文，就提供一些工具和资源导航。</p>

        <div class="hero-actions">
          <a class="mecha-btn primary" :href="withBase('/posts/')">进入日志终端</a>
          <a class="mecha-btn" :href="withBase('/tools/')">打开工具矩阵</a>
        </div>
      </div>

      <aside class="hero-panel">
        <div class="panel-title">档案概要</div>
        <dl class="panel-list">
          <template v-for="item in PROFILE" :key="item.label">
            <dt>{{ item.label }}</dt>
            <dd>{{ item.value }}</dd>
          </template>
        </dl>
      </aside>
    </section>

    <!-- 站点模块 -->
    <section class="home-flow">
      <h2 class="mecha-title">站点模块</h2>
      <div class="module-grid">
        <a v-for="item in MODULES" :key="item.href" class="module-card" :href="withBase(item.href)">
          <span class="module-code">{{ item.code }}</span>
          <span class="module-label">{{ item.label }}</span>
          <span class="module-desc">{{ item.desc }}</span>
          <svg class="module-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M5 12h14" />
            <path d="M12 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </section>

    <!-- 我的蛋仔派对 ID -->
    <section class="home-flow">
      <h2 class="mecha-title">我的蛋仔派对ID</h2>
      <div class="id-grid">
        <figure v-for="item in EGGY_IDS" :key="item.file" class="id-card">
          <a class="id-shot" :href="withBase(`/images/${item.file}`)" target="_blank">
            <img :src="withBase(`/images/${item.file}`)" :alt="`我的蛋仔派对${item.note}`" loading="lazy" />
          </a>
          <figcaption>
            <span class="id-badge">{{ item.note }}</span>
            <span class="id-name">{{ item.name }}</span>
          </figcaption>
        </figure>
      </div>
    </section>

    <!-- 签名说明 -->
    <section class="home-flow signature">
      <h2 class="mecha-title">关于这个站点</h2>
      <div class="signature-body">
        <p>
          这个网站的框架是用AI搭的，我只负责内容填充。不过，说句实话，如果我不给复杂的提示词，AI也生成不出来这种“风格缝合怪”的网站。<del>另外，AI总是喜欢把HTML代码和CSS、JS代码写一块，即使我特意说明分离也是如此。</del>最终思考权还是在人类手中。
        </p>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
@use '../../styles/variables' as *;
@use '../../styles/mixins' as *;

.home-view {
  max-width: $max-w;
  margin: 0 auto;
}

// ---- 驾驶舱概览 ----
.hero {
  display: grid;
  grid-template-columns: minmax(0, 1.65fr) minmax(0, 1fr);
  gap: 22px;
  align-items: stretch;

  @include respond-below($bp-md) {
    grid-template-columns: 1fr;
  }
}

.hero-body {
  padding: 26px 28px;
  background: $card;
  border: 1px solid $line;
  border-top: 2px solid var(--accent);
  clip-path: mecha-clip($cut-l);
  box-shadow: $shadow-card;
}

.hero-kicker {
  font-family: $font-mono;
  font-size: 11.5px;
  letter-spacing: 2px;
  color: $accent-2;
}

.hero-title {
  margin: 10px 0 14px;
  font-size: clamp(24px, 4vw, 34px);
  font-weight: 700;
  line-height: 1.35;
  letter-spacing: 0.5px;
  color: $ink;
}

.hero-desc {
  font-size: 15px;
  line-height: 1.85;
  color: $ink-2;

  + .hero-desc {
    margin-top: 10px;
  }
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 20px;

  a {
    text-decoration: none;
  }
}

.hero-panel {
  padding: 22px 22px 24px;
  background: $panel;
  border: 1px solid $line;
  clip-path: mecha-clip-dual(18px);

  .panel-title {
    margin-bottom: 14px;
    font-family: $font-mono;
    font-size: 11.5px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: $accent-2;
  }
}

.panel-list {
  dt {
    margin-top: 12px;
    font-family: $font-mono;
    font-size: 11.5px;
    letter-spacing: 1px;
    color: $ink-3;

    &:first-child {
      margin-top: 0;
    }
  }

  dd {
    margin-top: 3px;
    font-size: 14px;
    line-height: 1.65;
    color: $ink;
  }
}

// ---- 通用区块 ----
.home-flow {
  margin-top: 34px;
}

// ---- 站点模块 ----
.module-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  margin-top: 18px;
}

.module-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 18px 20px 20px;
  background: $card;
  border: 1px solid $line;
  clip-path: mecha-clip($cut-m);
  transition: border-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
  @include focus-ring;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: $accent-grad;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.32s cubic-bezier(0.22, 1, 0.36, 1);
  }

  &:hover {
    transform: translateY(-3px);
    border-color: $edge;
    box-shadow: $shadow-brand;

    &::before {
      transform: scaleX(1);
    }

    .module-arrow {
      color: var(--accent);
      transform: translateX(4px);
    }
  }

  .module-code {
    font-family: $font-mono;
    font-size: 11px;
    letter-spacing: 1.8px;
    color: $accent-2;
  }

  .module-label {
    font-size: 16.5px;
    font-weight: 600;
    color: $ink;
  }

  .module-desc {
    font-size: 13.5px;
    line-height: 1.6;
    color: $ink-2;
  }

  .module-arrow {
    position: absolute;
    right: 16px;
    bottom: 18px;
    width: 18px;
    height: 18px;
    color: $ink-3;
    transition: color 0.22s ease, transform 0.22s ease;
  }
}

// ---- 蛋仔 ID ----
.id-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
  margin-top: 18px;
}

.id-card {
  background: $card;
  border: 1px solid $line;
  clip-path: mecha-clip($cut-m);
  overflow: hidden;

  .id-shot {
    display: block;
    overflow: hidden;
    background: var(--accent-soft);
    border-bottom: 1px solid $line;

    img {
      width: 100%;
      height: auto;
      transition: transform 0.45s ease;
    }

    &:hover img {
      transform: scale(1.04);
    }
  }

  figcaption {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 16px 16px;
  }

  .id-badge {
    padding: 2px 9px;
    font-family: $font-mono;
    font-size: 11px;
    letter-spacing: 1px;
    color: var(--on-accent);
    background: $accent-grad;
    clip-path: mecha-clip-dual(6px);
  }

  .id-name {
    font-size: 15.5px;
    font-weight: 600;
    letter-spacing: 1px;
    color: $ink;
  }
}

// ---- 签名 ----
.signature-body {
  margin-top: 16px;
  padding: 20px 22px;
  background: $panel;
  border: 1px solid $line;
  border-left: 3px solid var(--accent);
  clip-path: mecha-clip($cut-m);

  p {
    font-size: 14.5px;
    line-height: 1.85;
    color: $ink-2;
  }

  del {
    color: $ink-3;
  }
}
</style>
