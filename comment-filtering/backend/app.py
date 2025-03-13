from fastapi import FastAPI
import uvicorn
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

# 필터링할 금칙어 리스트
BAD_WORDS = ["씨발", "병신", "1찍", "2찍","공산","이재명","윤석열"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CommentRequest(BaseModel):
    comments: list[str]  # 댓글 리스트 받기


@app.get("/")
def home():
    return {"message": "Comment filtering API is running!"}

@app.post("/filter")
def filter_comments(request: CommentRequest):
    filtered = [comment for comment in request.comments if any(word in comment for word in BAD_WORDS)]
    return {"filtered_comments": filtered}

# 서버 실행
if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)
