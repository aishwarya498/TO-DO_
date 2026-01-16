# To Do Application Database Queries

This file contains comprehensive SQL queries for managing the To Do application's MySQL database.

## Database Structure

The application uses two main tables:
- `users` - Stores user account information
- `tasks` - Stores task data linked to users

## Table Schemas

### Users Table
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Tasks Table
```sql
CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    text TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    due_date DATE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## How to Use

1. **Setup Database:**
   ```bash
   mysql -u root -p
   CREATE DATABASE to_do;
   USE to_do;
   SOURCE database_queries.sql;
   ```

2. **Run Specific Queries:**
   - Copy and paste individual queries from `database_queries.sql`
   - Execute them in your MySQL client or through your application

## Query Categories

### Basic CRUD Operations
- **Create**: INSERT statements for adding new users and tasks
- **Read**: SELECT statements for retrieving data
- **Update**: UPDATE statements for modifying existing records
- **Delete**: DELETE statements for removing records

### Advanced Queries
- **Filtering**: Queries to find tasks by priority, due date, completion status
- **Statistics**: Count queries for task summaries and analytics
- **Joins**: Queries combining user and task data
- **Date-based**: Queries for overdue tasks, tasks due today, etc.

### Utility Queries
- **Table Structure**: DESCRIBE and SHOW statements
- **Constraints**: Foreign key relationship queries
- **Backup**: Commands for database backup

## Sample Usage

### Get All Tasks for a User
```sql
SELECT id, text, completed, priority, due_date, created_at
FROM tasks
WHERE user_id = 1
ORDER BY created_at DESC;
```

### Get Overdue Tasks
```sql
SELECT id, text, priority, due_date
FROM tasks
WHERE user_id = 1
AND completed = FALSE
AND due_date < CURDATE()
ORDER BY due_date ASC;
```

### Get Task Statistics
```sql
SELECT
    COUNT(*) as total_tasks,
    SUM(CASE WHEN completed = TRUE THEN 1 ELSE 0 END) as completed,
    SUM(CASE WHEN due_date < CURDATE() AND completed = FALSE THEN 1 ELSE 0 END) as overdue
FROM tasks
WHERE user_id = 1;
```

## Security Notes

- Passwords in the sample data are placeholder hashes
- In production, always use proper password hashing (bcrypt)
- Use prepared statements in your application code
- Validate input data before executing queries

## Backup and Recovery

Regular backups are essential:
```bash
# Full database backup
mysqldump -u root -p to_do > full_backup.sql

# Individual table backups
mysqldump -u root -p to_do users > users_backup.sql
mysqldump -u root -p to_do tasks > tasks_backup.sql
```

## Performance Considerations

- The `user_id` foreign key in tasks table is indexed automatically
- Consider adding indexes on frequently queried columns like `due_date`, `priority`
- For large datasets, consider partitioning by date ranges

## Troubleshooting

- Ensure MySQL service is running
- Check database connection credentials in `.env` file
- Verify table creation with `DESCRIBE users;` and `DESCRIBE tasks;`
- Check foreign key constraints with the utility queries provided