#!/usr/bin/env bash
set -euo pipefail

TARGET="${SHUAN_TARGET:-/target}"
ARTIFACTS="${SHUAN_ARTIFACTS:-/artifacts}"
RUNTIME_DIR="$ARTIFACTS/container-runtime"
mkdir -p "$RUNTIME_DIR"/{logs,data,tmp}

cat <<MSG
[container] generic provisioning placeholder.
target=$TARGET
artifacts=$ARTIFACTS
runtime_dir=$RUNTIME_DIR
Provide a target-specific container_plan.context_files from the environment agent
when installation, service startup, users, license files, ports, or product-specific
initialization are required.
MSG
