# ベースイメージに node:23-slim を使用
FROM node:23-slim

# コンテナ内の作業ディレクトリを設定
WORKDIR /usr/src/app

# package系ファイルをコピー
COPY package*.json ./

# 依存関係インストール
RUN npm install 