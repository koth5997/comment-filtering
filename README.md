# 🌐 유튜브 & 네이버 뉴스 등등댓글 필터링 크롬 확장 프로그램

이 프로젝트는 크롬 확장 프로그램을 통해 유튜브와 네이버 뉴스 댓글에서 욕설 및 정치적인 댓글을 자동으로 감지하여 블러 처리하는 서비스입니다. 또한 다음이나 여러커뮤니티도 지원할 예정입니다.
백엔드는 FastAPI를 이용하여 필터링 API를 제공하며, 향후 AI(NLP 모델)을 적용하여 고급 필터링을 지원할 계획입니다.

---

## 🎯 프로젝트 목적
- 댓글 내 욕설 및 정치적 발언으로 인한 사회적 스트레스와 갈등 완화
- 인터넷 사용자 환경 개선을 통해 정신건강에 도움
- 확장 가능하고 실제 사용자에게 배포 가능한 프로젝트로 기술적 역량 증명

---

## ⚙️ 사용 기술

### Frontend (Chrome Extension)
- **JavaScript** (Vanilla JS)
- DOM Manipulation
- Chrome Extensions API
- HTML (popup.html)

### Backend
- **Python**
- **FastAPI** (RESTful API)
- **Uvicorn** (ASGI Server)
- **Pydantic** (Data Validation)
- **CORS Middleware** (Cross-Origin Resource Sharing)

### AI & Data (향후 추가 예정)
- **자연어 처리(NLP)** 모델을 활용한 댓글 필터링
- **Docker**를 활용한 컨테이너 기반 배포
- **Database**를 활용한 데이터 관리

---

## 🚀 프로젝트 구조
```
comment-filtering/
├── backend/
│   ├── database/
│   │   └── db.py
│   ├── models/
│   │   └── filter_model.py
│   ├── utils/
│   └── main.py
├── data/
│   ├── blacklist.txt
│   └── label_data.csv
├── extension/
│   ├── background.js
│   ├── content.js
│   ├── manifest.json
│   └── popup.html
├── notebooks/
│   └── model_training.ipynb
└── requirements.txt
└── .env
└── .gitignore
```

---

## ✅ 설치 및 실행 방법

### Backend

```bash
# 가상환경 생성 및 활성화 (권장)
conda create -n comment-filter python=3.11
conda activate comment-filter

# 필요한 패키지 설치
pip install -r requirements.txt

# FastAPI 서버 실행
cd backend
 uvicorn app:app --reload
```

### Chrome Extension

1. 크롬에서 `chrome://extensions` 이동
2. 개발자 모드 활성화
3. "압축 해제된 확장 프로그램 로드" 클릭 후 `extension` 폴더 선택
4. 유튜브 또는 네이버 뉴스 페이지에서 댓글 필터링 동작 확인

---

## 🖥️ 사용 예시

| 필터링 전 댓글 화면 | 필터링 후 댓글 화면 |
|-------------------|-------------------|
| (스크린샷 추가 예정) | (스크린샷 추가 예정) |

---

## 📌 주요 기능
- 유튜브와 네이버 뉴스 댓글 실시간 감지
- 지정된 금칙어(욕설, 정치적 키워드)가 포함된 댓글 자동 블러 처리
- 금칙어 목록 백엔드에서 쉽게 관리 가능 (FastAPI 기반)

---

## 🎓 향후 개선 및 확장 계획
- 개인 맞춤형 금칙어 설정 기능 추가
- 다양한 웹사이트 지원 확대 (페이스북, 트위터 등)
- AI 모델 (자연어 처리 기반) 도입을 통한 고급 필터링
- Docker 컨테이너화 및 클라우드 배포
- 사용자 피드백을 반영한 UI/UX 개선
- api배포
---

## 📄 License
- MIT License

---


