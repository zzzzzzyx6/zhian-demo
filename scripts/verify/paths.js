// 路径完整性检查：这个仓库没有构建步骤，所有 href/src 都是手写相对路径，
// 移动目录后最容易静默失效（页面白屏、样式丢失），所以单独校一遍。
//
//   node scripts/verify/paths.js
//
// 检查三件事：
//   1. 各 html 里的 <link href> 与 <script src> 是否指向真实文件；
//   2. 主平台 src/modules/scan.js 里嵌入扫描器的路径是否有效；
//   3. 扫描器内部的 ../ 回跳是否还能回到根目录的 index.html。
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
  return html;
}

const pages = ['index.html', 'src/scan-center/index.html'];
for (const p of pages) checkHtml(p);

// 主平台嵌入扫描器的地址
const scanJs = fs.readFileSync(path.join(ROOT, 'src/modules/scan.js'), 'utf8');
const m = scanJs.match(/const scanURL='([^']+)'/);
if (!m) problems.push('src/modules/scan.js 里找不到 scanURL');
else {
  checked.push('scan.js → ' + m[1]);
  if (!fs.existsSync(path.join(ROOT, m[1]))) problems.push('scan.js 的 iframe 地址无效：' + m[1]);
}

// 扫描器内部回跳根入口
const shell = fs.readFileSync(path.join(ROOT, 'src/scan-center/assets/zhian-shell.js'), 'utf8');
for (const hit of shell.matchAll(/location\.href='([^']+)'/g)) {
  const target = path.resolve(path.join(ROOT, 'src/scan-center'), hit[1]);
  checked.push('zhian-shell.js → ' + hit[1]);
  if (!fs.existsSync(target)) problems.push('zhian-shell.js 回跳目标无效：' + hit[1] + '（解析为 ' + path.relative(ROOT, target) + '）');
}

console.log('已检查 ' + checked.length + ' 条路径引用');
console.log(problems.length ? '问题 ' + problems.length + ' 处：\n  ' + problems.join('\n  ') : '全部可解析');
process.exit(problems.length ? 1 : 0);
