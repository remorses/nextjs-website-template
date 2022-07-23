FROM node:16-slim AS runner
RUN apt update && apt install -y curl tree

WORKDIR /app

ENV FOLDER website
ENV NODE_ENV production

COPY ./.next/standalone ./

WORKDIR /app/$FOLDER

COPY ./.next/static ./.next/static
COPY ./next.config.js ./
COPY ./public ./public
COPY ./package.json ./

EXPOSE 3000

ENV PORT 3000

# CMD tree ./
CMD node server.js
