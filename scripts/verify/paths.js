// 路径与挂载契约检查：这个仓库没有构建步骤，所有 href/src 都是手写相对路径，
// 移动目录后最容易静默失效（白屏、样式丢失），所以单独校一遍。
//
//   node scripts/verify/paths.js
//
// 检查：
//   1. index.html 里 <link href> 与 <script src> 是否指向真实文件；
//   2. 扫描器的挂载契约：scan.js 渲染 #scan-app，app.js 提供 window.ScanApp 并写入同一容器。
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const problems = [];
const checked = [];

function checkHtml(relHtml) {
  const abs = path.join(ROOT, relHtml);
  if (!fs.existsSync(abs)) { problems.push(relHtml + ' 不存在'); return; }
  const html = fs.readFileSync(abs, 'utf8');
  const dir = path.dirname(abs);
  const refs = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((m) => m[1])
    .filter((u) => !/^(https?:|data:|#|mailto:)/.test(u));
  for (const u of refs) {
    const target = path.resolve(dir, u.split('?')[0].split('#')[0]);
    checked.push(relHtml + ' → ' + u);
    if (!fs.existsSync(target)) problems.push(relHtml + ' 引用了不存在的文件：' + u);
  }
}

checkHtml('index.html');

// 挂载契约：平台侧只渲染容器，扫描器自己往里画。
const scanJs = fs.readFileSync(path.join(ROOT, 'src/modules/scan.js'), 'utf8');
if (!scanJs.includes("'<div id=\"scan-app\"")) problems.push('scan.js 不再渲染 #scan-app 容器');
if (!/window\.ScanApp\.(navigate|mount)/.test(scanJs)) problems.push('scan.js 没有调用 ScanApp');
checked.push('scan.js → #scan-app 容器 + ScanApp 挂载');

// 扫描器本体已并入 scan.js（scanner-app 段），契约检查只针对该段的文本，
// 不检查 review24 等平台侧段落（refine() 读 location.hash 是合法的时序判断）。
const marker = "AppParts['scan/scanner-app']";
const at = scanJs.indexOf(marker);
if (at < 0) problems.push('scan.js 里没有 scanner-app 段');
const appJs = at < 0 ? '' : scanJs.slice(at);
if (!appJs.includes("document.getElementById('scan-app')")) problems.push('scanner-app 段没有写入 #scan-app');
if (!appJs.includes('window.ScanApp')) problems.push('scanner-app 段没有暴露 window.ScanApp');
if (/location\.hash/.test(appJs)) problems.push('scanner-app 段仍在读 location.hash（路由应交给平台）');
if (/getElementById\(\s*['"]root['"]\s*\)/.test(appJs)) problems.push('scanner-app 段仍在找 #root 容器');
checked.push('scanner-app 段 → window.ScanApp + #scan-app');

console.log('已检查 ' + checked.length + ' 项');
console.log(problems.length ? '问题 ' + problems.length + ' 处：\n  ' + problems.join('\n  ') : '全部通过');
process.exit(problems.length ? 1 : 0);
