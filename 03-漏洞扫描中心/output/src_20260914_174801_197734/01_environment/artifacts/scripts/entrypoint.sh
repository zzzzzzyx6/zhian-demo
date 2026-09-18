#!/usr/bin/env bash
set -euo pipefail

cmd="${1:-check}"
case "$cmd" in
  shell)
    exec /bin/bash
    ;;
  check)
    exec /opt/shuan/scripts/check_container.sh
    ;;
  provision)
    shift || true
    exec /opt/shuan/scripts/provision_runtime.sh "$@"
    ;;
  *)
    exec "$@"
    ;;
esac
