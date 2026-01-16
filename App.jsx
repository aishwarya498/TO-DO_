import { useState, useEffect } from 'react'
import './App.css'
import { authAPI, tasksAPI, tokenManager } from './api'

// Authentication Components
const SignUp = ({ onSignUp, onSwitchToSignIn }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    try {
      const response = await authAPI.register({
        email: formData.email,
        password: formData.password,
      })

      // Store token and user data
      tokenManager.setToken(response.token)
      onSignUp(response.user)
    } catch (error) {
      setErrors({ general: error.message || 'Registration failed. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData({...formData, [field]: value})
    // Clear field-specific error when user starts typing
    if (errors[field]) {
      setErrors({...errors, [field]: ''})
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card signup-card">
        <div className="auth-header">
          <h2>🚀 Join Us Today</h2>
          <p>Create your account and start organizing your life</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {errors.general && (
            <div className="error-message general-error">
              <span className="error-icon">⚠️</span>
              {errors.general}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="signup-email">Email Address</label>
            <div className="input-wrapper">
              <span className="input-icon">📧</span>
              <input
                id="signup-email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={errors.email ? 'error' : ''}
                disabled={isLoading}
              />
            </div>
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="signup-password">Password</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a strong password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={errors.password ? 'error' : ''}
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.password && <span className="field-error">{errors.password}</span>}
            <div className="password-strength">
              <div className="strength-bar">
                <div
                  className={`strength-fill ${formData.password.length >= 6 ? 'weak' : ''} ${formData.password.length >= 8 && /(?=.*[a-z])(?=.*[A-Z])/.test(formData.password) ? 'medium' : ''} ${/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password) ? 'strong' : ''}`}
                ></div>
              </div>
              <span className="strength-text">
                {formData.password.length === 0 ? 'Password strength' :
                 formData.password.length < 6 ? 'Too weak' :
                 !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password) ? 'Weak' :
                 'Strong'}
              </span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="signup-confirm">Confirm Password</label>
            <div className="input-wrapper">
              <span className="input-icon">🔐</span>
              <input
                id="signup-confirm"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className={errors.confirmPassword ? 'error' : ''}
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
              >
                {showConfirmPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
          </div>

          <button type="submit" className="auth-btn primary" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Creating Account...
              </>
            ) : (
              <>
                <span className="btn-icon">🚀</span>
                Create Account
              </>
            )}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?
          <button onClick={onSwitchToSignIn} className="link-btn" disabled={isLoading}>
            Sign In Here
          </button>
        </p>
      </div>
    </div>
  )
}

const SignIn = ({ onSignIn, onSwitchToSignUp }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1200))

    try {
      const response = await authAPI.login({
        email: formData.email,
        password: formData.password,
      })

      // Store token and user data
      tokenManager.setToken(response.token)

      // Handle remember me
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true')
      } else {
        localStorage.removeItem('rememberMe')
      }

      onSignIn(response.user)
    } catch (error) {
      setErrors({ general: error.message || 'Login failed. Please check your credentials.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData({...formData, [field]: value})
    // Clear field-specific error when user starts typing
    if (errors[field]) {
      setErrors({...errors, [field]: ''})
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card signin-card">
        <div className="auth-header">
          <h2>👋 Welcome Back!</h2>
          <p>Sign in to continue organizing your tasks</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {errors.general && (
            <div className="error-message general-error">
              <span className="error-icon">⚠️</span>
              {errors.general}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="signin-email">Email Address</label>
            <div className="input-wrapper">
              <span className="input-icon">📧</span>
              <input
                id="signin-email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={errors.email ? 'error' : ''}
                disabled={isLoading}
                autoComplete="email"
              />
            </div>
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="signin-password">Password</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                id="signin-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={errors.password ? 'error' : ''}
                disabled={isLoading}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
              />
              <span className="checkmark"></span>
              Remember me
            </label>
          </div>

          <button type="submit" className="auth-btn primary" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Signing In...
              </>
            ) : (
              <>
                <span className="btn-icon">🚀</span>
                Sign In
              </>
            )}
          </button>
        </form>

        <p className="auth-switch">
          New to our platform?
          <button onClick={onSwitchToSignUp} className="link-btn" disabled={isLoading}>
            Create Account
          </button>
        </p>
      </div>
    </div>
  )
}

// Main To Do App Component
const TodoApp = ({ user, onLogout }) => {
  const [tasks, setTasks] = useState([])
  const [input, setInput] = useState('')
  const [priority, setPriority] = useState('medium')
  const [dueDate, setDueDate] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')
  const [editPriority, setEditPriority] = useState('medium')
  const [editDueDate, setEditDueDate] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Load tasks from API on mount
  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    try {
      setIsLoading(true)
      const tasksData = await tasksAPI.getTasks()
      setTasks(tasksData)
      setError('')
    } catch (err) {
      setError('Failed to load tasks. Please try again.')
      console.error('Load tasks error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const addTask = async () => {
    if (!input.trim()) return

    try {
      setIsLoading(true)
      const taskData = {
        text: input.trim(),
        priority,
        due_date: dueDate || null
      }
      const newTask = await tasksAPI.createTask(taskData)
      setTasks([newTask, ...tasks])
      setInput('')
      setPriority('medium')
      setDueDate('')
      setError('')
    } catch (err) {
      setError('Failed to add task. Please try again.')
      console.error('Add task error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleComplete = async (id) => {
    try {
      const task = tasks.find(t => t.id === id)
      if (!task) return

      const updatedTask = await tasksAPI.updateTask(id, { completed: !task.completed })
      setTasks(tasks.map(t => t.id === id ? updatedTask : t))
      setError('')
    } catch (err) {
      setError('Failed to update task. Please try again.')
      console.error('Toggle complete error:', err)
    }
  }

  const deleteTask = async (id) => {
    try {
      await tasksAPI.deleteTask(id)
      setTasks(tasks.filter(task => task.id !== id))
      setError('')
    } catch (err) {
      setError('Failed to delete task. Please try again.')
      console.error('Delete task error:', err)
    }
  }

  const startEdit = (id, text, taskPriority = 'medium', taskDueDate = '') => {
    setEditingId(id)
    setEditText(text)
    setEditPriority(taskPriority)
    setEditDueDate(taskDueDate)
  }

  const saveEdit = async () => {
    if (!editText.trim()) return

    try {
      setIsLoading(true)
      const updateData = {
        text: editText.trim(),
        priority: editPriority,
        due_date: editDueDate || null
      }
      const updatedTask = await tasksAPI.updateTask(editingId, updateData)
      setTasks(tasks.map(task =>
        task.id === editingId ? updatedTask : task
      ))
      setEditingId(null)
      setEditText('')
      setEditPriority('medium')
      setEditDueDate('')
      setError('')
    } catch (err) {
      setError('Failed to update task. Please try again.')
      console.error('Save edit error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditText('')
    setEditPriority('medium')
    setEditDueDate('')
  }

  const handleEditKeyPress = (e) => {
    if (e.key === 'Enter') {
      saveEdit()
    } else if (e.key === 'Escape') {
      cancelEdit()
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTask()
    }
  }

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      tokenManager.removeToken();
      onLogout();
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, clear local state
      tokenManager.removeToken();
      onLogout();
    }
  }

  return (
    <div className="app">
      <div className="header">
        <h1>✨ My To Do List ✨</h1>
        <div className="user-info">
          <span>Welcome, {user.email.split('@')[0]}!</span>
          <button onClick={handleLogout} className="logout-btn">🚪 Logout</button>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <span className="error-icon">⚠️</span>
          {error}
          <button onClick={() => setError('')} className="error-close">×</button>
        </div>
      )}

      <div className="input-container">
        <div className="task-input-group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="What needs to be done? 📝"
            disabled={isLoading}
            className="task-input"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            disabled={isLoading}
            className="priority-select"
          >
            <option value="low">🟢 Low</option>
            <option value="medium">🟡 Medium</option>
            <option value="high">🔴 High</option>
          </select>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            disabled={isLoading}
            className="due-date-input"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        <button onClick={addTask} disabled={isLoading || !input.trim()}>
          {isLoading ? '⏳' : '➕'} Add Task
        </button>
      </div>

      <ul className="task-list">
        {tasks.map(task => (
          <li key={task.id} className={`task ${task.completed ? 'completed' : ''}`}>
            {editingId === task.id ? (
              <div className="edit-container">
                <div className="edit-input-group">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyPress={handleEditKeyPress}
                    className="edit-input"
                    autoFocus
                    placeholder="Edit your task..."
                    disabled={isLoading}
                  />
                  <select
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value)}
                    disabled={isLoading}
                    className="edit-priority-select"
                  >
                    <option value="low">🟢 Low</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="high">🔴 High</option>
                  </select>
                  <input
                    type="date"
                    value={editDueDate}
                    onChange={(e) => setEditDueDate(e.target.value)}
                    disabled={isLoading}
                    className="edit-due-date-input"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="edit-buttons">
                  <button onClick={saveEdit} className="save-btn" disabled={isLoading}>
                    💾 Save
                  </button>
                  <button onClick={cancelEdit} className="cancel-btn" disabled={isLoading}>
                    ❌ Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="task-content">
                  <span onClick={() => toggleComplete(task.id)} className="task-text">
                    {task.completed ? '✅ ' : '⏳ '}{task.text}
                  </span>
                  <div className="task-meta">
                    <span className={`priority-badge priority-${task.priority || 'medium'}`}>
                      {task.priority === 'high' ? '🔴' : task.priority === 'low' ? '🟢' : '🟡'} {task.priority || 'medium'}
                    </span>
                    {task.due_date && (
                      <span className={`due-date ${new Date(task.due_date) < new Date() && !task.completed ? 'overdue' : ''}`}>
                        📅 {new Date(task.due_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="task-buttons">
                  <button onClick={() => startEdit(task.id, task.text, task.priority || 'medium', task.due_date || '')} className="edit-btn" disabled={isLoading}>
                    ✏️ Edit
                  </button>
                  <button onClick={() => deleteTask(task.id)} className="delete-btn" disabled={isLoading}>
                    🗑️ Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      {tasks.length === 0 && !isLoading && (
        <p className="empty">🎯 No tasks yet! Add your first task above to get started.</p>
      )}

      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      )}
    </div>
  )
}

function App() {
  const [user, setUser] = useState(null)
  const [authMode, setAuthMode] = useState('signin') // 'signin' or 'signup'

  // Check for existing session on mount
  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser')
    if (currentUser) {
      setUser(JSON.parse(currentUser)) // eslint-disable-line react-hooks/set-state-in-effect
    }
  }, [])

  const handleSignIn = (userData) => {
    setUser(userData)
    localStorage.setItem('currentUser', JSON.stringify(userData))
  }

  const handleSignUp = (userData) => {
    setUser(userData)
    localStorage.setItem('currentUser', JSON.stringify(userData))
  }

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      setUser(null);
      localStorage.removeItem('currentUser');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, clear local state
      setUser(null);
      localStorage.removeItem('currentUser');
    }
  }

  if (!user) {
    return authMode === 'signin' ? (
      <SignIn onSignIn={handleSignIn} onSwitchToSignUp={() => setAuthMode('signup')} />
    ) : (
      <SignUp onSignUp={handleSignUp} onSwitchToSignIn={() => setAuthMode('signin')} />
    )
  }

  return <TodoApp user={user} onLogout={handleLogout} />
}

export default App
