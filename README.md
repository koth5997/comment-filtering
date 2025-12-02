Comment Filtering Chrome Extension

유튜브와 네이버 뉴스 댓글에서 사용자 지정 금칙어를 실시간 탐지·블러 처리하는 Chrome 확장 프로그램입니다.
Google OAuth 기반 사용자 식별을 적용하여 개인별 맞춤 필터링 환경을 제공합니다.

1. 프로젝트 소개

온라인 댓글 환경은 정치적 갈등, 욕설, 혐오 표현 등으로 인해 피로도를 높이는 경우가 많습니다.
본 확장 프로그램은 사용자가 직접 금칙어를 등록하면, 해당 단어가 포함된 댓글을 탐지하여 숨기거나 블러 처리하는 기능을 제공합니다.

주요 특징은 다음과 같습니다.

Chrome 확장 프로그램 기반 실시간 댓글 필터링

Google OAuth 로그인 → 사용자별 금칙어 관리

FastAPI + MySQL 백엔드 연동

DOM MutationObserver 기반 댓글 탐지

YouTube / 네이버 뉴스 지원

2. 주요 기능
• 사용자 인증

Google OAuth2 인증을 통해 사용자 고유 ID 획득

background.js에서 userId 저장 및 content script로 전달

• 금칙어 관리 (CRUD)

백엔드와 연동된 API를 통해 사용자별 금칙어 저장:

금칙어 등록

금칙어 조회

금칙어 삭제

(백엔드 주요 코드 참조)

# 사용자 금칙어 추가
@app.post("/user_badwords")
def add_user_bad_word(request: UserBadWordRequest):
    ...


• 실시간 댓글 필터링

content.js가 DOM 변화 감지

사용자 금칙어 포함 댓글을 탐지 후 처리

블러 처리 / 숨기기 방식 적용 가능

• 확장 프로그램 UI

popup.html에서 금칙어 입력 및 목록 관리

background.js와 메시지 통신으로 userId 전달

(팝업 UI 예시 코드)

<input type="text" id="bad-word" placeholder="금칙어 입력">
<button id="add-word">추가</button>


3. 시스템 구조
전체 아키텍처
[ Chrome Extension ]
   ├── popup.html : 금칙어 입력 UI
   ├── background.js : userId 저장, 메시징 처리
   ├── content.js : 댓글 감지 및 필터링
   └── manifest.json : 권한, OAuth 설정
           ↓
[ FastAPI Backend ]
   ├── /user_badwords CRUD
   └── /filter 댓글 필터링 API
           ↓
[ MySQL Database ]
   ├── user_bad_words 테이블

4. 백엔드 구성 (FastAPI + MySQL)
• 환경변수 기반 MySQL 연결
DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
engine = create_engine(DATABASE_URL)


• 테이블 구조

init.sql 기준:

CREATE TABLE user_bad_words (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL,
    word VARCHAR(100) NOT NULL,
    category VARCHAR(500) DEFAULT '기타',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_word (user_id, word)
);


5. Chrome Extension 구성
manifest.json

Google OAuth2 client_id 설정

YouTube / 네이버 도메인에서 content.js 실행

백엔드 API 접근 허용

{
  "permissions": ["storage", "cookies", "identity", "identity.email"],
  "host_permissions": [
    "https://www.youtube.com/*",
    "https://n.news.naver.com/*",
    "http://127.0.0.1:8000/*"
  ]
}


background.js

popup / content 간 userId 전달

chrome.identity.getProfileUserInfo() 사용

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "SET_USER_ID") {
        currentUserId = message.userId;
    } else if (message.type === "GET_USER_ID") {
        sendResponse({ userId: currentUserId });
    }
});


6. 실행 방법
1) 백엔드 서버 실행
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

2) MySQL 초기화
mysql < init.sql

3) Chrome 확장 프로그램 로드

chrome://extensions 접속

“개발자 모드” 활성화

“압축해제된 확장 프로그램 로드”

프로젝트 폴더 선택
