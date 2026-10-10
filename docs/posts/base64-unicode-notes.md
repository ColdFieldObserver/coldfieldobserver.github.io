---
title: Base64 与 Unicode：编码互转时踩过的坑
date: 2026-10-08
categories: 技术笔记
tags: [编码, Base64, Unicode, JavaScript]
description: 记录在浏览器里做 Base64 / Unicode 互转时遇到的代理对、UTF-8 字节缓冲、溢出这几类问题与处理方式。
cover: /images/default_cover.svg
---

[TOC]

工具页上线前自测，把 Base64 与 Unicode 转换的边界情况整理一遍。

## 一、中文 Base64：`btoa` 为什么会炸

`btoa` 只接受 **Latin-1（U+0000 ~ U+00FF）** 范围内的字符，直接喂中文会得到：

```
InvalidCharacterError: String contains an invalid character
```

正确姿势是先做 UTF-8 编码，再逐字节转 Latin-1：

```js
function encodeBase64(input) {
  const bytes = new TextEncoder().encode(input);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}
```

反向则相反——先用 `atob` 拿回 Latin-1 串，再用 `TextDecoder` 还原 UTF-8：

```js
function decodeBase64(input) {
  const binary = atob(input);
  const bytes = Uint8Array.from(binary, (ch) => ch.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}
```

> [!WARNING]
> `atob` 遇到非法字符会抛 `InvalidCharacterError`，工具里必须 try/catch 掉再给出可读提示。

## 二、Unicode：代理对必须成对处理

一个 emoji（如 😀，`U+1F600`）在 UTF-16 里是两个码元：`\uD83D\uDE00`。
如果按 `for...of` 遍历字符串，拿到的是**完整码点**：

```js
for (const ch of '😀') console.log(ch.codePointAt(0).toString(16));
// 1f600
```

但如果用索引遍历，会把代理对拆成两半，输出 `\ud83d\ude00` —— 虽然结果也能被解析回来，可读性却很差。

推荐做法：`Array.from(str)` 后逐项转换：

```js
function toUnicodeEscape(str) {
  return Array.from(str)
    .map((ch) => '\\u' + ch.codePointAt(0).toString(16).padStart(4, '0'))
    .join('');
}
```

## 三、URL 编码的三兄弟

| 函数 | 保留字符 | 用途 |
| --- | --- | --- |
| `escape` | 极少 | **已废弃**，不要使用 |
| `encodeURI` | `;` `,` `/` `?` `:` `@` `&` `=` `+` `$` `#` | 编码完整 URL |
| `encodeURIComponent` | 仅 `-` `_` `.` `!` `~` `*` `'` `(` `)` | 编码查询参数 |

```js
const q = '机甲 & future';
encodeURIComponent(q); // '%E6%9C%BA%E7%94%B2%20%26%20future'
```

## 四、时间戳：秒还是毫秒

判断依据很简单——**毫秒是 13 位，秒是 10 位**。工具里按位数自动识别比让用户选流程图更省事：

```js
const ts = String(Number(raw));
const ms = ts.length <= 10 ? Number(ts) * 1000 : Number(ts);
const date = new Date(ms);
```

不过当 **2033 年** 来临后秒级时间戳会变成 11 位，届时这套判断会失效……留给未来的自己吧 :joy:

## 小结

1. 中文 Base64 一定要走 `TextEncoder` / `TextDecoder`。
2. Unicode 转换优先 `Array.from`，避开代理对陷阱。
3. URL 只用 `encodeURIComponent` 编码参数。
4. 时间戳靠位数区分秒 / 毫秒，并注意边界。

[^1]: MDN 上对 `btoa` 的限制有明确说明，踩坑前建议先读一小时文档。
