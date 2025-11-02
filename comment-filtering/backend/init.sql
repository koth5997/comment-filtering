
CREATE DATABASE IF NOT EXISTS commentfilter
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;


CREATE USER IF NOT EXISTS 'appuser'@'%' IDENTIFIED BY 'app_pass_123';
GRANT SELECT, INSERT, UPDATE, DELETE ON commentfilter.* TO 'appuser'@'%';
FLUSH PRIVILEGES;

USE commentfilter;


CREATE TABLE IF NOT EXISTS user_bad_words (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,  -- 충분한 ID 범위
    user_id VARCHAR(100) NOT NULL,
    word VARCHAR(255) NOT NULL,                              -- 단어는 조금 여유 있게
    category VARCHAR(100) DEFAULT '기타',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_word (user_id, word),             -- 중복 방지
    KEY idx_user_id (user_id)                                -- 조회 최적화
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
