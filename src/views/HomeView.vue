<template>
  <div class="content-card mica-card">
    <h2>欢迎来到冷域观者的个人网站！</h2>
    <p>我是冷域观者，一个逃跑吧少年和蛋仔派对玩家，偶尔也玩我的世界、PVZ2和保卫萝卜4，同时还是逃少音乐档案馆的主理人。曾用名AsyncObserver、蛋仔派对远航蛋、主唱耀星_Eggy、UNI-航行的灯塔、TP-RLX-LIGHT等，喜欢数码和技术。</p>
    <p>我也接触过编程，C、C++、C#、Python、HTML、CSS、JavaScript都懂一点，有时候也会试着用别的语言重构几个易语言项目玩玩（易语言的缺点你们懂的）。</p>
    <p>这里是我的个人网站。当然我不在这里发博文，就提供一些工具和资源导航。</p>

    <h3>我的蛋仔派对ID</h3>
    <div style="text-align: center;">
      <a :href="baseUrl + 'image/eggypartyid.jpg'" target="_blank">
        <img :src="baseUrl + 'image/eggypartyid.jpg'" alt="我的蛋仔派对大号" style="max-width: 100%; height: auto; cursor: zoom-in;">
      </a>
      <p style="margin-top: 1rem;">实况主灯塔</p>
      <a :href="baseUrl + 'image/eggypartyid2.jpg'" target="_blank">
        <img :src="baseUrl + 'image/eggypartyid2.jpg'" alt="我的蛋仔派对小号" style="max-width: 100%; height: auto; cursor: zoom-in;">
      </a>
      <p style="margin-top: 1rem;">翌测</p>
    </div>

    <div class="intro-signature">
      <p>这个网站的框架是用AI搭的，我只负责内容填充。不过，说句实话，如果我不给复杂的提示词，AI也生成不出来这种"风格缝合怪"的网站。<del>另外，AI总是喜欢把HTML代码和CSS、JS代码写一块，即使我特意说明分离也是如此。</del>最终思考权还是在人类手中。</p>
    </div>
  </div>
</template>

<script setup>
const baseUrl = import.meta.env.BASE_URL
</script>