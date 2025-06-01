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