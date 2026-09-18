FROM rockylinux:8
SHELL ["/bin/bash", "-lc"]
RUN set -eux; \
    if command -v dnf >/dev/null 2>&1; then \
 dnf -y install findutils file unzip procps-ng net-tools which glibc-langpack-en || \
 dnf -y install findutils file unzip procps-ng net-tools which; \
      dnf clean all; \
    elif command -v apt-get >/dev/null 2>&1; then \
      apt-get update; \
      DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends bash coreutils findutils file tar gzip unzip procps net-tools ca-certificates passwd; \
      rm -rf /var/lib/apt/lists/*; \
    else \
      echo "No supported package manager found; continuing with base image tools"; \
    fi
RUN groupadd -r shuan 2>/dev/null || true; \
    id shuan >/dev/null 2>&1 || useradd -m -g shuan -s /bin/bash shuan
ENV LANG=C.UTF-8 LC_ALL=C.UTF-8 SHUAN_TARGET=/target SHUAN_ARTIFACTS=/artifacts
WORKDIR /workspace
COPY scripts/ /opt/shuan/scripts/
RUN chmod +x /opt/shuan/scripts/*.sh
ENTRYPOINT ["/opt/shuan/scripts/entrypoint.sh"]
