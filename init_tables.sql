CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Vytvorenie tabuliek (bez cudzich klucov)
CREATE TABLE groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    created_by UUID NOT NULL,
    xp INTEGER DEFAULT 0 CHECK (xp >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    xp INTEGER DEFAULT 0 CHECK (xp >= 0),
    group_id UUID NOT NULL,
    name VARCHAR(100) NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    subject VARCHAR(100) NOT NULL
);

CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_id UUID NOT NULL,
    question TEXT NOT NULL
);

CREATE TABLE answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL,
    answer_text TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID NOT NULL,
    group_id UUID NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL
);

CREATE TABLE user_achievements (
    user_id UUID NOT NULL,
    achievement_id UUID NOT NULL,
    achieved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, achievement_id)
);

-- Pridanie cudzi klucov do tabuliek
ALTER TABLE groups ADD CONSTRAINT groups_created_by FOREIGN KEY (created_by) REFERENCES users(id);
ALTER TABLE users ADD CONSTRAINT users_group FOREIGN KEY (group_id) REFERENCES groups(id);
ALTER TABLE questions ADD CONSTRAINT questions_test FOREIGN KEY (test_id) REFERENCES tests(id);
ALTER TABLE answers ADD CONSTRAINT answers_question FOREIGN KEY (question_id) REFERENCES questions(id);
ALTER TABLE chat_messages ADD CONSTRAINT chat_messages_sender FOREIGN KEY (sender_id) REFERENCES users(id);
ALTER TABLE chat_messages ADD CONSTRAINT chat_messages_group FOREIGN KEY (group_id) REFERENCES groups(id);
ALTER TABLE notifications ADD CONSTRAINT notifications_user FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE user_achievements ADD CONSTRAINT user_achievements_user FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE user_achievements ADD CONSTRAINT user_achievements_achievement FOREIGN KEY (achievement_id) REFERENCES achievements(id);
