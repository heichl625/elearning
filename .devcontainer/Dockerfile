FROM node:14.15.1-buster-slim

ARG USER=node
ARG GROUP=node

SHELL [ "bash", "-c" ]

RUN set -o pipefail \
    #
    # Install system dependencies
    && apt update \
    && apt install --yes --no-install-recommends \
        ca-certificates \
        curl \
        g++ \
        git \
        gnupg \
        jq \
        make \
        openssh-client \
        procps \
        python3 \
        socat \
        sudo \
    && rm -rf /var/lib/apt/lists/* \
    #
    # Install docker client
    && curl -fsSL https://download.docker.com/linux/debian/gpg | apt-key add - \
    && echo "deb [arch=amd64] https://download.docker.com/linux/debian buster stable" > /etc/apt/sources.list.d/docker.list \
    && apt update \
    && apt install --yes --no-install-recommends docker-ce-cli \
    && rm -rf /var/lib/apt/lists/* \
    #
    # Install docker compose
    && COMPOSE_URL="$( \
        curl -fsSL https://api.github.com/repos/docker/compose/releases/latest \
        | jq --raw-output '[.assets[] | select(.name == "docker-compose-Linux-x86_64")][0].browser_download_url' \
    )" \
    && curl -fsSL "${COMPOSE_URL}" -o /usr/local/bin/docker-compose \
    && chmod +x /usr/local/bin/docker-compose \
    #
    # Add sudo
    && echo "${USER} ALL=(root) NOPASSWD:ALL" > "/etc/sudoers.d/${USER}" \
    && chmod 0440 "/etc/sudoers.d/${USER}"

WORKDIR "/home/${USER}"
USER "${USER}:${GROUP}"

COPY --chown="${USER}:${GROUP}" ./docker-entrypoint.sh ./
RUN chmod 0755 ./docker-entrypoint.sh \
    && echo "alias ll='ls -alF'" >> "/home/${USER}/.bashrc"
ENV PATH="/home/${USER}/.yarn/bin:${PATH}"

ENTRYPOINT [ "./docker-entrypoint.sh" ]
