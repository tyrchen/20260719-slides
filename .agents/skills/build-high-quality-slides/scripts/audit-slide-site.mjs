#!/usr/bin/env node

import { access, mkdtemp, readFile, rm } from 'node:fs/promises';
import { constants } from 'node:fs';
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { basename, dirname, extname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const input = args[0] && !args[0].startsWith('--') ? args.shift() : 'index.html';
const options = {
  width: 1280,
  height: 720,
  slideSelector: '.slide',
  titleSelector: 'h2',
  minTitleSize: 34,
  wait: 5000,
  chrome: process.env.CHROME_BIN || '',
};

for (let index = 0; index < args.length; index += 1) {
  const key = args[index];
  const value = args[index + 1];
  if (!key.startsWith('--') || value === undefined) throw new Error(`Invalid argument: ${key}`);
  const name = key.slice(2).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
  if (!(name in options)) throw new Error(`Unknown option: ${key}`);
  options[name] = ['width', 'height', 'minTitleSize', 'wait'].includes(name) ? Number(value) : value;
  index += 1;
}

if (typeof WebSocket === 'undefined') {
  throw new Error('This audit script requires Node.js 22 or newer (global WebSocket support).');
}

const candidates = [
  options.chrome,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  process.env.PROGRAMFILES ? join(process.env.PROGRAMFILES, 'Google/Chrome/Application/chrome.exe') : '',
].filter(Boolean);

let chrome = '';
for (const candidate of candidates) {
  try {
    await access(candidate, constants.X_OK);
    chrome = candidate;
    break;
  } catch {}
}
if (!chrome) throw new Error('Chrome/Chromium not found. Set CHROME_BIN to its executable path.');

let server;
let target = input;
if (!/^https?:/.test(input)) {
  const entry = input.startsWith('file:') ? fileURLToPath(input) : resolve(input);
  const root = dirname(entry);
  const mime = {
    '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml',
    '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2',
  };
  server = createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      const path = resolve(root, `.${pathname}`);
      if (path !== root && !path.startsWith(`${root}${sep}`)) {
        response.writeHead(403).end('Forbidden');
        return;
      }
      const body = await readFile(path);
      response.writeHead(200, { 'content-type': mime[extname(path).toLowerCase()] || 'application/octet-stream' }).end(body);
    } catch {
      response.writeHead(404).end('Not found');
    }
  });
  await new Promise((resolvePromise, rejectPromise) => {
    server.once('error', rejectPromise);
    server.listen(0, '127.0.0.1', resolvePromise);
  });
  server.unref();
  target = `http://127.0.0.1:${server.address().port}/${encodeURIComponent(basename(entry))}`;
}
const port = 9300 + (process.pid % 500);
const profile = await mkdtemp(join(tmpdir(), 'slide-audit-'));
const browser = spawn(chrome, [
  '--headless=new',
  '--disable-gpu',
  '--hide-scrollbars',
  `--window-size=${options.width},${options.height}`,
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${profile}`,
  target,
], { stdio: 'ignore' });

const sleep = milliseconds => new Promise(resolvePromise => setTimeout(resolvePromise, milliseconds));
const deadline = Date.now() + Math.max(options.wait, 3000);
let tabs = [];
while (Date.now() < deadline) {
  try {
    const response = await fetch(`http://127.0.0.1:${port}/json`);
    tabs = await response.json();
    if (tabs.some(tab => tab.type === 'page' && tab.url !== 'about:blank' && !tab.url.startsWith('chrome-extension:'))) break;
  } catch {}
  await sleep(100);
}

const tab = tabs.find(item => item.type === 'page' && item.url !== 'about:blank' && !item.url.startsWith('chrome-extension:'));
if (!tab) {
  browser.kill('SIGKILL');
  await rm(profile, { recursive: true, force: true });
  throw new Error('The slide page did not become available before the timeout.');
}

const expression = `(() => {
  const slides = [...document.querySelectorAll(${JSON.stringify(options.slideSelector)})];
  const rows = slides.map((slide, index) => {
    const title = slide.querySelector(${JSON.stringify(options.titleSelector)});
    const titleSize = title ? parseFloat(getComputedStyle(title).fontSize) : null;
    return {
      slide: index + 1,
      title: title?.textContent?.trim() || '',
      overflow: slide.scrollHeight > slide.clientHeight + 2,
      titleOverflow: Boolean(title && title.scrollWidth > title.clientWidth + 2),
      titleSize,
    };
  });
  return JSON.stringify({
    url: location.href,
    viewport: { width: innerWidth, height: innerHeight },
    count: slides.length,
    overflow: rows.filter(row => row.overflow).map(row => row.slide),
    titleOverflow: rows.filter(row => row.titleOverflow).map(row => row.slide),
    smallTitles: rows.filter(row => row.titleSize !== null && row.titleSize < ${Number(options.minTitleSize)}),
  });
})()`;

const socket = new WebSocket(tab.webSocketDebuggerUrl);
let requestId = 0;
const pending = new Map();
await new Promise((resolvePromise, rejectPromise) => {
  const timer = setTimeout(() => rejectPromise(new Error('Chrome DevTools connection timed out.')), 5000);
  socket.addEventListener('open', () => { clearTimeout(timer); resolvePromise(); });
  socket.addEventListener('error', () => rejectPromise(new Error('Chrome DevTools WebSocket failed.')));
});
socket.addEventListener('message', event => {
  const message = JSON.parse(event.data);
  const handler = pending.get(message.id);
  if (!handler) return;
  pending.delete(message.id);
  if (message.result?.exceptionDetails) handler.reject(new Error(message.result.exceptionDetails.text));
  else handler.resolve(message.result.result.value);
});
const evaluate = source => new Promise((resolvePromise, rejectPromise) => {
  const id = ++requestId;
  pending.set(id, { resolve: resolvePromise, reject: rejectPromise });
  socket.send(JSON.stringify({ id, method: 'Runtime.evaluate', params: { expression: source } }));
});

const renderDeadline = Date.now() + Math.max(options.wait, 5000);
let slideCount = 0;
while (Date.now() < renderDeadline) {
  slideCount = Number(await evaluate(`document.querySelectorAll(${JSON.stringify(options.slideSelector)}).length`));
  if (slideCount > 0) break;
  await sleep(150);
}
if (!slideCount) {
  const state = await evaluate(`JSON.stringify({ href: location.href, readyState: document.readyState, scripts: [...document.scripts].map(script => script.src), bodyText: document.body?.innerText?.slice(0, 120) })`);
  throw new Error(`No slides matched ${options.slideSelector} before the timeout. Page state: ${state}`);
}
await sleep(350);
const result = JSON.parse(await evaluate(expression));
socket.close();

browser.kill('SIGKILL');
await rm(profile, { recursive: true, force: true });
server?.close();

console.log(JSON.stringify(result, null, 2));
if (result.count === 0 || result.overflow.length || result.titleOverflow.length || result.smallTitles.length) process.exitCode = 1;
