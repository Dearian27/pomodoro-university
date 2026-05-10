import React, { useEffect } from 'react'
import { useTimer } from '../hooks/useTimer'
import { useStatistics } from '../hooks/useStatistics'
import '../styles/Timer.css'

function Timer() {
  const timer = useTimer()
  const { addSession } = useStatistics()

  useEffect(() => {
    // Request notification permission on mount
    timer.requestNotificationPermission()
  }, [timer])

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getSessionColor = () => {
    if (timer.sessionType === 'work') return 'work'
    if (timer.sessionType === 'break') return 'short-break'
    return 'long-break'
  }

  const getSessionLabel = () => {
    if (timer.sessionType === 'work') return 'Work Session'
    if (timer.sessionType === 'break') return 'Short Break'
    return 'Long Break'
  }

  // Calculate progress percentage
  const totalTime = 
    timer.sessionType === 'work' 
      ? timer.settings.workDuration * 60
      : timer.sessionType === 'break'
      ? timer.settings.shortBreak * 60
      : timer.settings.longBreak * 60

  const progress = ((totalTime - timer.timeLeft) / totalTime) * 100

  return (
    <div className={`timer-container ${getSessionColor()}`}>
      <div className="session-info">
        <span className="session-label">{getSessionLabel()}</span>
        <span className="session-count">Completed: {timer.sessionsCompleted}</span>
      </div>

      <div className="timer-display">
        <div className="timer-circle">
          <svg viewBox="0 0 200 200" className="progress-ring">
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              opacity="0.1"
            />
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeDasharray={`${565 * (progress / 100)} 565`}
              strokeLinecap="round"
              style={{ transition: 'stroke-dasharray 0.5s ease' }}
            />
          </svg>
          <div className="timer-text">
            <span className="timer-value">{formatTime(timer.timeLeft)}</span>
          </div>
        </div>
      </div>

      <div className="timer-controls">
        {!timer.isRunning ? (
          <button 
            className="btn btn-primary"
            onClick={timer.start}
          >
            ▶ Start
          </button>
        ) : (
          <>
            {!timer.isPaused ? (
              <button 
                className="btn btn-warning"
                onClick={timer.pause}
              >
                ⏸ Pause
              </button>
            ) : (
              <button 
                className="btn btn-primary"
                onClick={timer.resume}
              >
                ▶ Resume
              </button>
            )}
          </>
        )}
        
        <button 
          className="btn btn-secondary"
          onClick={timer.reset}
        >
          🔄 Reset
        </button>
      </div>
    </div>
  )
}

export default Timer
