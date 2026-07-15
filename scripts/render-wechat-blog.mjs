#!/usr/bin/env node

import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { mkdir } from 'node:fs/promises';

const [, , inputArg = 'tubi-meetup-blog.md', outputArg = 'dist/blog.html'] = process.argv;
const inputPath = resolve(inputArg);
const outputPath = resolve(outputArg);

const colors = {
  ink: '#172033',
  muted: '#667085',
  accent: '#2867f0',
  accentSoft: '#edf4ff',
  line: '#dce6f5',
  paper: '#ffffff',
  canvas: '#f4f7fb',
  quote: '#0f2b5b',
};

const escapeHtml = (value) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

const inline = (source) => {
  const code = [];
  let value = escapeHtml(source).replace(/`([^`]+)`/g, (_, text) => {
    const token = `@@CODE${code.length}@@`;
    code.push(`<code style="margin:0 2px;padding:2px 6px;border-radius:5px;background:#eef2f7;color:#344054;font-family:SFMono-Regular,Consolas,monospace;font-size:.88em;">${text}</code>`);
    return token;
  });

  value = value
    .replace(/\*\*([^*]+)\*\*/g, `<strong style="color:${colors.ink};font-weight:750;">$1</strong>`)
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, `<a href="$2" style="color:${colors.accent};text-decoration:none;border-bottom:1px solid #9bbcfb;">$1</a>`);

  code.forEach((html, index) => { value = value.replace(`@@CODE${index}@@`, html); });
  return value;
};

const paragraph = (text) => {
  const standaloneStrong = text.match(/^\*\*(.+)\*\*([。！？]?)$/);
  if (standaloneStrong) {
    return `<section style="margin:30px 0;padding:22px 24px;border:1px solid #c9dafb;border-radius:12px;background:${colors.accentSoft};box-shadow:0 8px 24px rgba(40,103,240,.08);">
      <p style="margin:0;color:${colors.quote};font-size:18px;line-height:1.85;font-weight:750;letter-spacing:.01em;">${inline(standaloneStrong[1])}${standaloneStrong[2]}</p>
    </section>`;
  }

  return `<p style="margin:0 0 20px;color:${colors.ink};font-size:17px;line-height:1.95;letter-spacing:.015em;text-align:justify;">${inline(text)}</p>`;
};

const renderMarkdown = (markdown) => {
  const lines = markdown.replaceAll('\r\n', '\n').split('\n');
  const output = [];
  let title = '文章';
  let sectionNumber = 0;

  for (let index = 0; index < lines.length;) {
    const raw = lines[index].trim();
    if (!raw) { index += 1; continue; }

    const heading = raw.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      const level = heading[1].length;
      const text = heading[2];
      if (level === 1) {
        title = text;
        output.push(`<header style="margin:0 0 46px;padding:34px 28px 30px;border-radius:18px;background:${colors.quote};box-shadow:0 18px 44px rgba(15,43,91,.18);">
          <p style="margin:0 0 16px;color:#8fb7ff;font-size:12px;line-height:1.4;font-weight:700;letter-spacing:.18em;">TUBI MEETUP · 2026.07.19</p>
          <h1 style="margin:0;color:#fff;font-size:34px;line-height:1.28;font-weight:800;letter-spacing:-.025em;">${inline(text)}</h1>
          <p style="margin:20px 0 0;padding-top:18px;border-top:1px solid rgba(255,255,255,.18);color:#c9d8f4;font-size:14px;line-height:1.7;">从软件、可穿戴设备、技术写作到工程师的未来</p>
        </header>`);
      } else {
        sectionNumber += 1;
        output.push(`<section style="margin:48px 0 24px;">
          <p style="margin:0 0 8px;color:${colors.accent};font-size:12px;line-height:1.4;font-weight:750;letter-spacing:.15em;">${String(sectionNumber).padStart(2, '0')} · 核心话题</p>
          <h2 style="margin:0;padding-bottom:13px;border-bottom:2px solid ${colors.accent};color:${colors.ink};font-size:25px;line-height:1.45;font-weight:800;letter-spacing:-.015em;">${inline(text)}</h2>
        </section>`);
      }
      index += 1;
      continue;
    }

    if (raw.startsWith('>')) {
      const quote = [];
      while (index < lines.length && lines[index].trim().startsWith('>')) {
        quote.push(lines[index].trim().replace(/^>\s?/, ''));
        index += 1;
      }
      output.push(`<blockquote style="position:relative;margin:30px 0;padding:26px 26px 24px 30px;border:0;border-left:5px solid ${colors.accent};border-radius:0 14px 14px 0;background:${colors.accentSoft};box-shadow:0 9px 26px rgba(40,103,240,.07);">
        <p style="margin:0 0 8px;color:${colors.accent};font-family:Georgia,serif;font-size:38px;line-height:.7;font-weight:700;">“</p>
        <p style="margin:0;color:${colors.quote};font-size:19px;line-height:1.85;font-weight:700;letter-spacing:.01em;">${inline(quote.join(' '))}</p>
      </blockquote>`);
      continue;
    }

    const listMatch = raw.match(/^[-*]\s+(.+)$/);
    if (listMatch) {
      const items = [];
      while (index < lines.length) {
        const item = lines[index].trim().match(/^[-*]\s+(.+)$/);
        if (!item) break;
        items.push(`<li style="margin:0 0 10px;padding-left:4px;color:${colors.ink};font-size:17px;line-height:1.85;">${inline(item[1])}</li>`);
        index += 1;
      }
      output.push(`<ul style="margin:2px 0 24px;padding-left:24px;">${items.join('')}</ul>`);
      continue;
    }

    const text = [];
    while (index < lines.length) {
      const line = lines[index].trim();
      if (!line || /^(#{1,3})\s+/.test(line) || line.startsWith('>') || /^[-*]\s+/.test(line)) break;
      text.push(line);
      index += 1;
    }
    output.push(paragraph(text.join(' ')));
  }

  return { title, body: output.join('\n') };
};

const markdown = await readFile(inputPath, 'utf8');
const rendered = renderMarkdown(markdown);
const html = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="light">
  <title>${escapeHtml(rendered.title)}</title>
</head>
<body style="margin:0;background:${colors.canvas};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC','Hiragino Sans GB','Microsoft YaHei',sans-serif;-webkit-font-smoothing:antialiased;">
  <main style="box-sizing:border-box;width:100%;max-width:760px;margin:0 auto;padding:42px 22px 64px;background:${colors.paper};">
    <article style="margin:0;">${rendered.body}</article>
    <footer style="margin:54px 0 0;padding:24px 0 0;border-top:1px solid ${colors.line};text-align:center;">
      <p style="margin:0;color:${colors.muted};font-size:13px;line-height:1.8;letter-spacing:.08em;">TUBI MEETUP · 把 AI 变成工程团队</p>
    </footer>
  </main>
</body>
</html>`;

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, html);
console.log(`Rendered ${inputPath} -> ${outputPath}`);
