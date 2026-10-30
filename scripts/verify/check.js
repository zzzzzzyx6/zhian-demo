// One command for the standard local checks. Stop immediately on any failure.
const { spawnSync } = require('child_process');
const path = require('path');

for (const script of [
  'source-check.js',
  'paths.js',
  'css-audit.js',
  'boot-check.js',
  'scan-mount-check.js',
  'fingerprint.js',
]) {
  console.log('\n' + script);
  const result = spawnSync(process.execPath, [path.join(__dirname, script)], { stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status || 1);
}
