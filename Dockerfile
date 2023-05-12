ARG WORKDIR=/code

FROM node:14.15.1-buster-slim AS libs

ARG WORKDIR
ARG MODE

RUN \
    # Install system dependencies
    apt update \
    && apt install --yes --no-install-recommends \
        g++ \
        jq \
        make \
        python3 \
    && rm -rf /var/lib/apt/lists/* \

    && mkdir -p "${WORKDIR}" \

WORKDIR "${WORKDIR}"

COPY package.json yarn.lock ./
COPY packages/server/package.json ./packages/server/
COPY packages/client/package.json ./packages/client/
RUN yarn install --frozen-lockfile \
    && yarn cache clean

FROM libs AS runtime-libs

RUN jq '.workspaces |= ["packages/server"]' package.json > pacakge.json.tmp \
    && mv pacakge.json.tmp package.json \
    && yarn install --frozen-lockfile --production \
    && yarn cache clean


FROM libs AS build

ARG MODE

COPY  ./packages/server/ ./packages/server/
COPY ./packages/client/ ./packages/client/
RUN cp ./packages/client/.env.${MODE} ./packages/client/.env \
    && yarn workspace @melearn/client run build


FROM node:14.15.1-buster-slim

ARG WORKDIR
ARG MODE

RUN mkdir "${WORKDIR}"

WORKDIR "${WORKDIR}"

COPY --from=runtime-libs "/node_modules/" ./node_modules/
COPY --from=build "/packages/server/" ./packages/server/
COPY --from=build "/packages/client/build/" ./packages/client/build/

RUN cp ./packages/server/.env.${MODE} ./packages/server/.env
    #&& echo "\nNODE_ENV=production\nCLIENT_ASSET_DIRECTORY=./packages/client/build/\nBASE_URL=https://melearn-dev.dev.innopage.com\nTZ=Asia/Hong_Kong\nENQUIRY_EMAIL=melearn@enrichculture.com" >> ./packages/server/.env

COPY ./docker-entrypoint.sh ./
RUN chmod 0770 ./docker-entrypoint.sh
ENTRYPOINT [ "./docker-entrypoint.sh" ]