from dotenv import load_dotenv
load_dotenv() 
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import pymysql
from sqlalchemy import create_engine, text

load_dotenv
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_NAME = os.getenv("DB_NAME")

DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
engine = create_engine(DATABASE_URL)


class UserBadWordRequest(BaseModel):
    user_id: str
    word: str
    category: str = "기타"

#금칙어 목록 가져옴옴
@app.get("/user_badwords/{user_id}")
def get_user_bad_words(user_id: str):
    with engine.connect() as conn:
        result = conn.execute(text("SELECT word FROM user_bad_words WHERE user_id = :user_id"),
                              {"user_id": user_id})
        words = [row[0] for row in result.fetchall()]
    return {"bad_words": words}

# 금칙어 추가
@app.post("/user_badwords")
def add_user_bad_word(request: UserBadWordRequest):
    with engine.connect() as conn:
        conn.execute(text(
            "INSERT INTO user_bad_words (user_id, word, category) VALUES (:user_id, :word, :category)"
        ), request.dict())
        conn.commit()
    return {"message": f"'{request.word}' 금칙어 추가 완료!"}

# 금칙어 삭제
@app.delete("/user_badwords/{user_id}/{word}")
def delete_user_bad_word(user_id: str, word: str):
    with engine.connect() as conn:
        conn.execute(text(
            "DELETE FROM user_bad_words WHERE user_id = :user_id AND word = :word"
        ), {"user_id": user_id, "word": word})
        conn.commit()
    return {"message": f"'{word}' 금칙어 삭제 완료!"}

@app.get("/")
def home():
    return {"message": "FastAPI MySQL 금칙어 관리 API입니다"}
class CommentList(BaseModel):
    comments: list[str]

@app.post("/filter")
def filter_comments(comment_list: CommentList):
    with engine.connect() as conn:
        result = conn.execute(text("SELECT word FROM bad_words"))
        bad_words = [row[0] for row in result.fetchall()]

    # 금칙어가 포함된 댓글만 추출
    filtered = [
        comment for comment in comment_list.comments
        if any(word in comment for word in bad_words)
    ]
    return {"filtered_comments": filtered}

# 사용자별 금칙어 목록 (지금은 그냥 전체 금칙어 반환)
@app.get("/user_badwords/{user_id}")
def get_user_bad_words(user_id: str):
    with engine.connect() as conn:
        result = conn.execute(text("SELECT word FROM bad_words"))
        words = [row[0] for row in result.fetchall()]
    return {"bad_words": words}
# 서버 실행
if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)
