from dotenv import load_dotenv
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import pymysql
from sqlalchemy import create_engine, text
import logging

load_dotenv()

app = FastAPI()
EXTENSION_ORIGIN = os.getenv("EXTENSION_ORIGIN", "chrome-extension://")


origins_list = [
    "chrome-extension://mjepfbdgnbjlfjigooobambmohgkkpck",  
    
    "http://localhost:8080",
    "http://127.0.0.1:8000",
    "https://n.news.naver.com",
    "https://www.youtube.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "chrome-extension://mjepfbdgnbjlfjigooobambmohgkkpck",
        "http://localhost:8080",
        "https://n.news.naver.com",                             
        "https://www.youtube.com"   
    ],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
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

class CommentFilterRequest(BaseModel):
    user_id: str
    comments: list[str]


@app.get("/")
def home():
    return {"message": "FastAPI MySQL 금칙어 관리 API입니다"}

# 사용자 금칙어 목록 가져오기
@app.get("/user_badwords/{user_id}")
def get_user_bad_words(user_id: str):
    with engine.connect() as conn:
        result = conn.execute(
            text("SELECT word, category FROM user_bad_words WHERE user_id = :user_id"),
            {"user_id": user_id}
        )
        rows = result.fetchall()  # [(word, category), …]
    return {
        "bad_words": [
            {"word": r[0], "category": r[1]}
            for r in rows
        ]
    }


# 사용자 금칙어 추가
@app.post("/user_badwords")
def add_user_bad_word(request: UserBadWordRequest):
    with engine.connect() as conn:
        conn.execute(
            text("INSERT INTO user_bad_words (user_id, word, category) VALUES (:user_id, :word, :category)"),
            request.dict()
        )
        conn.commit()
    return {"message": f"'{request.word}' 금칙어 추가 완료!"}

# 사용자 금칙어 삭제
@app.delete("/user_badwords/{user_id}/{word}")
def delete_user_bad_word(user_id: str, word: str):
    with engine.connect() as conn:
        conn.execute(
            text("DELETE FROM user_bad_words WHERE user_id = :user_id AND word = :word"),
            {"user_id": user_id, "word": word}
        )
        conn.commit()
    return {"message": f"'{word}' 금칙어 삭제 완료!"}

# 댓글 필터링 API (사용자 금칙어만 적용)
@app.post("/filter")
def filter_comments(req: CommentFilterRequest):
    with engine.connect() as conn:
        user_words = conn.execute(
            text("SELECT word FROM user_bad_words WHERE user_id = :user_id"),
            {"user_id": req.user_id}
        ).fetchall()

    bad_words = [row[0] for row in user_words]

    filtered = [
        comment for comment in req.comments
        if any(word in comment for word in bad_words)
    ]
    return {"filtered_comments": filtered}

# 서버 실행
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)