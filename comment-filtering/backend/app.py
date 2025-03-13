from fastapi import FastAPI
import uvicorn
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

# 필터링할 금칙어 리스트
BAD_WORDS = ["이건 정상 댓글", "씨발 뭐야", "1찍", "2찍","공산","이재명","윤석열"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 모든 도메인 허용
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# 요청 받을 데이터 모델
class CommentRequest(BaseModel):
    comments: list[str]  # 댓글 리스트 받기

# 기본 루트 엔드포인트 추가
@app.get("/")
def home():
    return {"message": "Comment filtering API is running!"}

# 필터링 API (POST 요청)
@app.post("/filter")
def filter_comments(request: CommentRequest):
    filtered = [comment for comment in request.comments if any(word in comment for word in BAD_WORDS)]
    return {"filtered_comments": filtered}

# 서버 실행
if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)
