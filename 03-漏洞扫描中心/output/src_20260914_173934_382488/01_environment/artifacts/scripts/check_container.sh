#!/usr/bin/env bash
set -euo pipefail

echo "[container] target=${SHUAN_TARGET:-/target}"
echo "[container] artifacts=${SHUAN_ARTIFACTS:-/artifacts}"
test -d "${SHUAN_TARGET:-/target}" || { echo "target mount missing"; exit 2; }
mkdir -p "${SHUAN_ARTIFACTS:-/artifacts}/container-runtime"
id shuan
for tool in bash tar gzip unzip file timeout; do
  command -v "$tool" >/dev/null 2>&1 && echo "tool[$tool]=ok" || echo "tool[$tool]=missing"
done
find "${SHUAN_TARGET:-/target}" -maxdepth 3 -type f -print | head -40
