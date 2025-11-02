# Dockerfile
FROM python:3.11-bullseye
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# (선택) 빌드 필요한 패키지 대응
RUN apt-get update && apt-get install -y --no-install-recommends build-essential \
    && rm -rf /var/lib/apt/lists/*

# 의존성 먼저 설치 (레이어 캐시 활용)
COPY requirements.txt .
RUN python -m pip install --upgrade pip setuptools wheel \
 && pip install --no-cache-dir --force-reinstall -r requirements.txt

# 앱 소스 반영
COPY . .

# uvicorn 실행
CMD ["uvicorn", "main:app", "--host","0.0.0.0","--port","8000"]
