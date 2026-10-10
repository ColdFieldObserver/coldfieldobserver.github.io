---
title: 站点重构：从静态页到机甲风 VitePress
date: 2026-10-10
categories: 站点日志
tags: [VitePress, 重构, 机甲]
description: 用 VitePress + Vue3 + TypeScript + SCSS 重写整站，记录技术选型、目录结构与主题实现的要点。
cover: /images/default_cover.svg
stickypost: true
---

[TOC]

本站完成了从「手写静态页」到「VitePress 驱动」的整体重构。这篇记录一下重构过程中的技术决策，方便日后回溯。

## 为什么重写

原来的站点由若干彼此独立的 `index.html` 拼成，存在几个绕不过去的问题：

1. **重复代码**：每个页面各自维护一份导航栏与侧边栏 HTML，改一处要改 N 处。
2. **没有 Markdown**：写日志只能手写 HTML，`<p>`、`<br>` 满天飞。
3. **无法检索**：内容全在静态 HTML 里，没有索引，只能靠浏览器的 `Ctrl + F`。

> 做工具站点最怕的是「维护成本随页面数线性增长」，于是重构的第一目标就是**消除重复**。

## 技术栈

| 层 | 选型 | 理由 |
| --- | --- | --- |
| 构建 | VitePress | Markdown 原生、SSG 产物纯静态，可直接丢 GitHub Pages |
| 视图 | Vue 3 `<script setup>` | 组件化 + 组合式函数，逻辑复用直观 |
| 语言 | TypeScript | 工具函数与数据结构有类型约束 |
| 样式 | SCSS | 变量 / 混入统一管理，切角、光带等机甲元素靠 `clip-path` |

```ts
// 数据加载：构建期把 posts/*.md 抽成轻量列表
export default createContentLoader('posts/*.md', {
  transform(raw): Post[] {
    return raw.map(toBasePost).sort(byDateDesc);
  },
});
```

## 机甲视觉的四个关键元素

### 1. 切角：`clip-path`

所有卡片都带统一规格的斜切角。用 polygon 生成的好处是**不需要额外 DOM 节点**：

```scss
clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px));
```

### 2. 扫描线背景

整站背景叠一层极淡的重复渐变，模拟 CRT 扫描线，透明度控制在 `0.03` 以内以免干扰正文：

```css
repeating-linear-gradient(180deg, rgba(255,255,255,.03) 0 1px, transparent 1px 3px);
```

### 3. HUD 网格

视口固定一层网格线，随滚动保持静止，营造「舱窗」感。

### 4. 冷色强调 + 三态主题

主题光 **auto / light / dark** 三档：

- [x] `auto` 跟随系统偏好
- [x] `light` 强制浅色
- [x] `dark` 强制深色

全部通过 `<html data-theme>` 属性切换，CSS 变量随之改变。

## 动效清单

- **加载动画**：机甲六边形核心 + 环形进度条 + 打字机状态文本。
- **页面切换**：`out-in` 过渡 + 横向扫描光。
- **滚动进入**：`IntersectionObserver` 观察 `.reveal`，元素进入视口时上浮淡入。

```js
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-revealed');
      observer.unobserve(entry.target);
    }
  });
});
```

> [!TIP]
> 所有动效都包裹在 `prefers-reduced-motion: reduce` 的降级判断里，晕动症用户不受影响。

## 接下来

- [ ] 补齐剩下工具的离线缓存
- [ ] 为日志文件增加封面图规范
- [ ] 接入 Umami 统计（不依赖 Cookie）

如果你也对这类机甲风站点感兴趣，欢迎在评论区交流 :wave:
