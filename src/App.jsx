import React, { useEffect } from 'react'
import { useTimerManager, SESSION_TYPES } from './hooks/useTimerManager'
import TimerItem from './components/TimerItem'
import Statistics from './components/Statistics'
import { ThemeProvider } from './contexts/ThemeContext'
import './styles/App.css'

function App() {
  const timerManager = useTimerManager()
  const [showStats, setShowStats] = React.useState(false)

  // Timer loop - оновлення часу кожну секунду
  useEffect(() => {
    const interval = setInterval(() => {
      timerManager.timers.forEach(timer => {
        if (timer.isRunning && !timer.isPaused) {
          timerManager.decrementTime(timer.id)
        }
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [timerManager])

  // Запит дозволу на сповіщення
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }

    // Якщо таймерів немає - додати один за замовчуванням
    if (timerManager.timers.length === 0) {
      timerManager.addTimer(SESSION_TYPES.WORK, 0, 25, 0)
    }
  }, [])

  const handleAddTimer = () => {
    timerManager.addTimer(SESSION_TYPES.WORK, 0, 25, 0)
  }

  return (
    <ThemeProvider>
      <div className="app-container">
        <header className="app-header">
          <h1>Pomodoro Timer</h1>
          <div className="header-controls">
            <button 
              className="btn-stats-header"
              onClick={() => setShowStats(!showStats)}
              title="Statistics"
            >
              Stats
            </button>
            <button 
              className="theme-toggle"
              onClick={() => {
                const html = document.documentElement
                const currentTheme = html.getAttribute('data-theme')
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark'
                html.setAttribute('data-theme', newTheme)
                localStorage.setItem('theme', newTheme)
              }}
              title="Toggle theme"
            >
              Theme
            </button>
          </div>
        </header>

        <main className="app-main">
          <div className="timers-container">
            {timerManager.timers.length > 0 ? (
              <>
                <div className="timers-list">
                  {timerManager.timers.map(timer => (
                    <TimerItem
                      key={timer.id}
                      timer={timer}
                      isActive={timer.id === timerManager.activeTimerId}
                      onToggle={() => timerManager.toggleTimer(timer.id)}
                      onPause={() => timerManager.pauseTimer(timer.id)}
                      onResume={() => timerManager.resumeTimer(timer.id)}
                      onSkip={() => timerManager.skipTimer(timer.id)}
                      onReset={() => timerManager.resetTimer(timer.id)}
                      onDelete={() => timerManager.deleteTimer(timer.id)}
                      onTimeChange={timerManager.updateTimerTime}
                      onTypeChange={timerManager.updateSessionType}
                    />
                  ))}
                </div>

                <button 
                  className="btn-add-timer"
                  onClick={handleAddTimer}
                  title="Add new timer"
                >
                  <span>+</span>
                </button>
              </>
            ) : (
              <div className="empty-state">
                <p>No timers yet</p>
                <button 
                  className="btn-add-timer-primary"
                  onClick={handleAddTimer}
                >
                  + Add Timer
                </button>
              </div>
            )}
          </div>

          {showStats && <Statistics timers={timerManager.timers} onClose={() => setShowStats(false)} />}
        </main>

        <footer className="app-footer">
          <p>Pomodoro Timer v2.0.0 • Built with React + Vite</p>
        </footer>
      </div>
    </ThemeProvider>
  )
}

export default App
