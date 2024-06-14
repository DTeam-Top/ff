FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NODE_OPTIONS="--enable-source-maps"
RUN corepack enable
RUN apk add --no-cache tini su-exec
RUN adduser -s /bin/false -S -D app
ENTRYPOINT ["/sbin/tini", "-g", "--"]

FROM base AS build
RUN apk add --no-cache git python3 make g++
COPY . /usr/app/
WORKDIR /usr/app/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
  pnpm install --frozen-lockfile && \
  pnpm -F admin -F bot -F cron -F frame run build && \
  pnpm --filter dbdomain --prod deploy pruned/dbdomain && \
  pnpm --filter admin --prod deploy pruned/admin && \
  pnpm --filter bot --prod deploy pruned/bot && \
  pnpm --filter cron --prod deploy pruned/cron && \
  pnpm --filter frame --prod deploy pruned/frame

FROM base AS dbdomain
COPY --from=build /usr/app/pruned/dbdomain/ /usr/app/
WORKDIR /usr/app/
CMD [ "pnpm", "run", "migrate" ]

FROM base AS admin
COPY --from=build --chown=app /usr/app/pruned/admin/ /usr/app/
WORKDIR /usr/app/
EXPOSE 3000
CMD ["su-exec", "app", "node", "dist/index.js"]

FROM base AS bot
COPY --from=build --chown=app /usr/app/pruned/bot/ /usr/app/
WORKDIR /usr/app/
EXPOSE 3001
CMD ["su-exec", "app", "node", "dist/index.js"]

FROM base AS cron
COPY --from=build --chown=app /usr/app/pruned/cron/ /usr/app/
WORKDIR /usr/app/
CMD ["su-exec", "app", "node", "dist/index.js"]

FROM base AS frame
COPY --from=build --chown=app /usr/app/pruned/frame/ /usr/app/
WORKDIR /usr/app/
ENV PORT=3002
EXPOSE 3002
CMD ["su-exec", "app", "pnpm", "start"]
