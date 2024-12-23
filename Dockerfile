FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci


FROM node:20-alpine
ENV ENV="default env"
ENV HOME=/home/customuser
RUN addgroup -S customgroup && \
    adduser -S -G customgroup customuser && \
    mkdir -p $HOME/app && \
    chown -R customuser:customgroup $HOME
WORKDIR $HOME/app
COPY --from=builder /app/node_modules ./node_modules
COPY --chown=customuser:customgroup index.js .
COPY --chown=customuser:customgroup package*.json .

USER customuser

ENTRYPOINT [ "node", "index.js" ]