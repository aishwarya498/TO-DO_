-- Simple SQL Queries for To Do Application

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    text TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    due_date DATE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- User queries
SELECT id, email, password FROM users WHERE email = ?;  -- Login
INSERT INTO users (email, password) VALUES (?, ?);      -- Register
SELECT COUNT(*) FROM users WHERE email = ?;             -- Check email exists

-- Task queries
SELECT id, text, completed, priority, due_date, created_at FROM tasks WHERE user_id = ? ORDER BY created_at DESC;  -- Get tasks
INSERT INTO tasks (user_id, text, priority, due_date) VALUES (?, ?, ?, ?);  -- Create task
UPDATE tasks SET completed = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?;  -- Toggle complete
UPDATE tasks SET text = ?, priority = ?, due_date = ? WHERE id = ? AND user_id = ?;  -- Update task
DELETE FROM tasks WHERE id = ? AND user_id = ?;  -- Delete task