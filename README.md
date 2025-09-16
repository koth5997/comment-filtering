# 개인화 댓글 필터링 확장프로그램

사용자 맞춤형 금칙어를 통해 YouTube와 네이버 뉴스 댓글을 실시간으로 필터링하는 Chrome Extension입니다.

## 주요 기능

- **실시간 댓글 필터링**: MutationObserver를 활용한 동적 댓글 감지 및 필터링
- **사용자 맞춤 금칙어**: Google OAuth 인증을 통한 개인별 금칙어 관리
- **카테고리별 분류**: 욕설, 정치, 혐오 등 카테고리별 금칙어 구분
- **멀티 플랫폼 지원**: YouTube, 네이버 뉴스 댓글 동시 지원
- **비크롤링 방식**: 브라우저 내부 DOM 접근으로 차단 회피 불가능

## 기술 스택

### Frontend (Chrome Extension)
- **Manifest V3**
- **Google OAuth2** - 사용자 인증
- **MutationObserver** - 실시간 DOM 변화 감지

### Backend
- **FastAPI** - Python 웹 프레임워크
- **SQLAlchemy** - ORM 
- **PyMySQL** - MySQL 드라이버
- **Python-dotenv** - 환경변수 관리

### Database
- **MySQL 8.0**

### DevOps
- **Docker & Docker Compose** - 컨테이너화
- **CORS** - 크로스 오리진 요청 처리

## 프로젝트 구조

```
comment-filtering/
├── backend/
│   ├── main.py                 # FastAPI 메인 애플리케이션
│   ├── requirements.txt        # Python 패키지 의존성
│   ├── Dockerfile             # 백엔드 컨테이너 설정
│   ├── docker-compose.yml     # 서비스 오케스트레이션
│   ├── init.sql              # 데이터베이스 초기화
│   └── .env                  # 환경변수
└── extension/
    ├── manifest.json         # 확장프로그램 설정
    ├── background.js         # 서비스 워커
    ├── content.js           # 댓글 필터링 로직
    ├── popup.html           # 팝업 UI
    └── popup.js            # 팝업 기능
```

## 설치 및 실행

### 1. 저장소 클론

```bash
git clone https://github.com/your-username/comment-filtering.git
cd comment-filtering
```

### 2. 백엔드 실행

```bash
cd backend

# Docker Compose로 실행 (권장)
docker compose up --build

# 또는 로컬 실행
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### 3. Chrome Extension 설치

1. Chrome 브라우저에서 `chrome://extensions/` 접속
2. "개발자 모드" 활성화
3. "압축해제된 확장 프로그램을 로드합니다" 클릭
4. `extension` 폴더 선택

### 4. OAuth 설정

```javascript
// manifest.json의 client_id를 본인 Google Cloud Console 프로젝트로 변경
"client_id": "YOUR_GOOGLE_OAUTH_CLIENT_ID"
```

## API 엔드포인트

### 사용자 금칙어 관리
- `GET /user_badwords/{user_id}` - 금칙어 목록 조회
- `POST /user_badwords` - 금칙어 추가
- `DELETE /user_badwords/{user_id}/{word}` - 금칙어 삭제

### 댓글 필터링
- `POST /filter` - 댓글 텍스트 배열을 받아 필터링된 댓글 반환

### 상태 확인
- `GET /` - 서버 상태 확인

## 데이터베이스 스키마

```sql
CREATE TABLE user_bad_words (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL,
    word VARCHAR(100) NOT NULL,
    category VARCHAR(500) DEFAULT '기타',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_word (user_id, word)
);
```

## 기술적 특징

### 크롤링이 아닌 브라우저 네이티브 접근
- 외부 HTTP 요청이 아닌 브라우저 내부 DOM 직접 접근
- Cloudflare, CAPTCHA 등 크롤링 차단 기술에 영향받지 않음
- 사용자 브라우저에서 실행되므로 차단 불가능

### 실시간 동적 콘텐츠 처리
- MutationObserver로 SPA의 동적 댓글 로딩 감지
- 페이지 리로드 없는 댓글 추가/삭제 실시간 대응

### 확장 가능한 아키텍처
- 새로운 사이트 추가 용이
- 카테고리별 필터링 규칙 확장 가능

## 환경 변수

```env
DB_USER=appuser
DB_PASSWORD=your_password
DB_HOST=localhost  # Docker: db
DB_PORT=3307
DB_NAME=commentfilter
PORT=8000
EXTENSION_ORIGIN="chrome-extension://your-extension-id"
```

## 개발 환경

- Python 3.11+
- Node.js 16+ (선택사항)
- MySQL 8.0
- Docker & Docker Compose

## 기여하기

1. 이 저장소를 Fork 합니다
2. 새로운 기능 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 Push 합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다

## 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 문의

프로젝트에 대한 질문이나 제안사항이 있으시면 Issues를 통해 연락주세요.

---

**참고**: 이 확장프로그램은 사용자의 브라우징 경험 향상을 위해 개발되었으며, 개인정보보호 정책을 준수합니다.
