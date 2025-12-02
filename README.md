# 댓글 필터링 크롬 확장 & FastAPI 백엔드

유튜브·네이버 뉴스 댓글에서 **사용자 맞춤 금칙어**를 기준으로 댓글을 탐지/블러 처리하는 프로젝트입니다.  
크롬 확장 프로그램이 실시간으로 댓글을 스캔하고, FastAPI 백엔드가 사용자별 금칙어를 **MySQL**에 저장·관리합니다.

---

## 주요 기능
- **Google 로그인 기반 사용자 식별** (chrome.identity)
- **금칙어 CRUD API** 제공: 추가 / 삭제 / 조회 / 댓글 필터링
- **유튜브·네이버 뉴스 댓글 실시간 탐지 및 블러 처리**
- **Docker 기반 로컬 개발 환경 구성**
- **CORS 도메인 제한 설정 (보안 강화)**

---

## 아키텍처 개요

```text
[Chrome Extension]
  ├─ popup.html / popup.js : 금칙어 UI
  ├─ background.js : 로그인 사용자 ID 관리
  └─ content.js : 댓글 DOM 탐지 → blur 처리

          │  (message)
          ▼
[FastAPI Backend]
  ├─ /user_badwords (POST/GET/DELETE)
  └─ /filter (POST)
          │
          ▼
[MySQL]
  └─ user_bad_words(user_id, word, category, created_at)
```
## 디렉터리 구조
```
backend/
 ├─ main.py            # FastAPI 진입점
 ├─ init.sql           # MySQL 스키마 초기화
 ├─ Dockerfile         # 백엔드 도커 설정
 ├─ docker-compose.yml # FastAPI + MySQL 통합 실행

extension/
 ├─ manifest.json
 ├─ background.js
 ├─ popup.html
 ├─ popup.js
 └─ content.js
```
##데이터베이스 스키마 (inti.sql)
```
CREATE DATABASE IF NOT EXISTS commentfilter;
CREATE USER IF NOT EXISTS 'appuser'@'%' IDENTIFIED BY 'app_pass_123';
GRANT SELECT, INSERT, DELETE, UPDATE ON commentfilter.* TO 'appuser'@'%';
FLUSH PRIVILEGES;

USE commentfilter;

CREATE TABLE IF NOT EXISTS user_bad_words (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL,
    word VARCHAR(100) NOT NULL,
    category VARCHAR(500) DEFAULT '기타',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_word (user_id, word)
);
```

##백엔드 (FastAPI, Docker)
#FastAPI 실행 방법
```
 # 1. 의존성 설치
pip install -r requirements.txt

# 2. 서버 실행
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
#Docker 실행 방법
```
docker-compose up --build
```
#실행 후 확인
```
# FastAPI 상태 확인
curl http://127.0.0.1:8000/

# MySQL 접속 확인
docker exec -it comment-db mysql -u appuser -p

#중단
docker-compose down

```

## 크롬 확장 구성
manifest.json

Manifest V3 기반

권한: storage, cookies, identity, identity.email

OAuth2 client_id, Google API 스코프 포함

host_permissions: YouTube, Naver, Google API, localhost

background: Service Worker 등록

popup.html, content_scripts 매핑

background.js

chrome.runtime.onMessage 수신 후 userId 관리

chrome.identity.getProfileUserInfo()로 로그인 사용자 식별

popup.html

금칙어 입력 및 추가 버튼 UI

금칙어 목록 표시 (API 연동 예정)

## 보안 및 개선 계획

 OAuth Client ID, 스코프 정책 검증

 DB 계정 최소 권한 부여

 금칙어 정규식 / 변형 문자 대응

 Rate Limit 

 UI 커스터마이즈 (블러 강도, 표시 문구)

## 향후 로드맵

 금칙어 카테고리별 토글

 사이트별 필터링 커스터마이즈

 로그 / 통계 기능 추가

 사용자 인터페이스 개선

## 라이선스

이 프로젝트는 MIT License 또는 Apache-2.0 License를 권장합니다.
(LICENSE 파일을 루트 디렉터리에 추가하세요.)

## 제작자
동서대학교 컴퓨터공학과 고태희 졸업작품  — 댓글 필터링 시스템
Backend: FastAPI, MySQL
Frontend: Chrome Extension (Manifest V3)
Container: Docker / Docker Compose
