# 🧼 Comment Filtering Extension

Chrome에서 유튜브와 네이버 뉴스 댓글을 필터링해주는 확장 프로그램입니다.  
사용자별 금칙어 설정이 가능하며, Google 계정을 통해 사용자 ID를 가져옵니다.  
FastAPI 기반 백엔드와 MySQL을 연동하여 금칙어 관리를 수행합니다.

---

## ✅ 주요 기능

- [x] 유튜브 및 네이버 댓글 실시간 감지 및 필터링  
- [x] 금칙어가 포함된 댓글 자동 블러 처리  
- [x] 사용자별 금칙어 등록/삭제  
- [x] Google 로그인 연동으로 사용자 ID 식별  
- [x] FastAPI + MySQL 백엔드 서버 연동  
- [x] 댓글 영역 변경 시 실시간 감지 및 필터링

---

## 🧩 프로젝트 구조

```
📁 extension/
├── background.js         # Google 로그인, userId 전달
├── content.js            # 댓글 추출 및 금칙어 필터링
├── manifest.json         # 확장 프로그램 메타 정보
├── popup.html            # 금칙어 추가/삭제 UI
├── popup.js              # 사용자 입력 처리
📁 backend/
├── main.py               # FastAPI 서버 + DB 연결
```

---

## ⚙️ 사용 기술

| 분류 | 기술 |
|------|------|
| Frontend | JavaScript, HTML |
| Backend | FastAPI, SQLAlchemy, pymysql |
| DB | MySQL |
| Chrome API | identity, runtime, storage |
| 인증 | Google OAuth2 (Chrome Identity API) |

---

## 🔌 설치 및 실행 방법

### 🔧 FastAPI 서버 실행

```bash
# 1. 의존성 설치
pip install fastapi uvicorn python-dotenv pymysql sqlalchemy

# 2. .env 파일 설정
DB_USER=your_username
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=3306
DB_NAME=your_database

# 3. 서버 실행
python main.py
```

---

### 🧩 크롬 확장 프로그램 설치

1. `chrome://extensions` 접속
2. **우측 상단 '개발자 모드' 활성화**
3. `확장 프로그램 폴더` 선택 → `압축 해제된 확장 프로그램 로드`
4. 댓글 영역에 자동으로 필터링 적용됨

---

## 🧪 예시

- 유튜브 댓글: `#content-text`  
- 네이버 댓글: `.u_cbox_contents`  
- 금칙어 포함 시 댓글 `blur(5px)` 처리 + 빨간 테두리

---

## 🧠 향후 개선 사항 (To-Do)

- [ ] 금칙어 자동 추천 기능
- [ ] 블러 처리 대신 가림말로 대체 기능
- [ ] 사용자별 금칙어 카테고리화 UI
- [ ] 댓글 내 단어 빈도 통계 시각화
- [ ] 다국어 지원 (영어/일본어 등)

---

## 👨‍💻 개발자 정보

- 주요 개발: 사용자 금칙어 관리 API, 댓글 필터링 로직, 크롬 OAuth 연동
- 확장성과 사용자 편의성을 고려하여 모듈화 및 실시간 처리 중심 설계
