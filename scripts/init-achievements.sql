BEGIN;

INSERT INTO achievements (title, description, condition_type, condition_value, icon_path)
VALUES
('Chatty Beginner', 'Send 10 messages', 'message_sent', 10, '/images/achievements/message_sent_1.png'),
('Chatty Intermediate', 'Send 30 messages', 'message_sent', 30, '/images/achievements/message_sent_2.png'),
('Chatty Master', 'Send 50 messages', 'message_sent', 50, '/images/achievements/message_sent_3.png');

INSERT INTO achievements (title, description, condition_type, condition_value, icon_path)
VALUES
('Regular Visitor', 'Login 5 times', 'login_count', 5, '/images/achievements/login_count_1.png'),
('Frequent Visitor', 'Login 10 times', 'login_count', 10, '/images/achievements/login_count_2.png'),
('Daily Visitor', 'Login 20 times', 'login_count', 20, '/images/achievements/login_count_3.png');

COMMIT;