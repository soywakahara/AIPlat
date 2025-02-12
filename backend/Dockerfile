FROM python:3.11-slim

WORKDIR /usr/src/backend

COPY requirements.txt .

# システムパッケージのインストールを分割
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        gcc \
        python3-dev \
        build-essential \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Pythonパッケージのインストールを分割
RUN pip install --no-cache-dir -r requirements.txt