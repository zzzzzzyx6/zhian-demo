// Only remove identical declarations for the exact same selector in the same
// conditional block. Keep the last occurrence to preserve cascade order.
const fs = require('fs');
const path = require('path');
const postcss = require('postcss');

const root = path.resolve(__dirname, '../..');
const fix = process.argv.includes('--fix');
let total = 0;

for (const file of ['src/styles/app.css', 'src/styles/scan-app.css']) {
  const target = path.join(root, file);
  const sheet = postcss.parse(fs.readFileSync(target, 'utf8'), { from: target });
  let duplicates = 0;

  function visit(parent) {
    const seen = new Set();
    for (const rule of [...parent.nodes].reverse()) {
      if (rule.type === 'rule' && rule.nodes.every((n) => ['decl', 'comment'].includes(n.type))) {
        for (const declaration of [...rule.nodes].reverse()) {
          if (declaration.type !== 'decl') continue;
          const key = JSON.stringify([
            rule.selector,
            declaration.prop,
            declaration.value,
            Boolean(declaration.important),
          ]);
          if (seen.has(key)) {
            duplicates++;
            if (fix) declaration.remove();
          } else {
            seen.add(key);
          }
        }
        if (fix && rule.nodes.length === 0) rule.remove();
      }
      if (rule.type === 'atrule' && rule.nodes) visit(rule);
    }
  }

  visit(sheet);
  if (fix && duplicates) fs.writeFileSync(target, sheet.toString());
  console.log(`${file}: ${duplicates} identical declarations ${fix ? 'removed' : 'found'}`);
  total += duplicates;
}

if (!fix && total) process.exitCode = 1;
