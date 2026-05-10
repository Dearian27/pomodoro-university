import React from 'react'
import { SESSION_TYPE_LABELS } from '../hooks/useTimerManager'
import '../styles/Statistics.css'

function Statistics({ timers = [], onClose }) {
  const totalSessions = timers.reduce((sum, t) => sum + t.sessionsCompleted, 0)
  const totalTime = timers.reduce((sum, t) => sum + (t.initialTime - t.timeLeft), 0)

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${h}h ${m}m ${s}s`
  }

  const formatMinutes = (seconds) => {
    return Math.floor(seconds / 60)
  }

  return (
    <div className="statistics-panel">
      <div className="stats-header">
        <h2>Statistics</h2>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>

      <div className="stats-content">
        <div className="stats-overview">
          <div className="stat-card">
            <div className="stat-value">{totalSessions}</div>
            <div className="stat-label">Total Sessions</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{Math.floor(totalTime / 60)}</div>
            <div className="stat-label">Minutes Focused</div>
          </div>
        </div>

        <div className="stats-section">
          <h3>Timers Overview</h3>
          <div className="timers-stats">
            {timers.length > 0 ? (
              timers.map(timer => (
                <div key={timer.id} className="timer-stat-item">
                  <div className="timer-stat-header">
                    <span className="timer-type">{SESSION_TYPE_LABELS[timer.sessionType]}</span>
                    <span className="sessions-badge">{timer.sessionsCompleted}</span>
                  </div>
                  <div className="timer-stat-details">
                    <span>Duration: {formatTime(timer.initialTime)}</span>
                    <span>Created: {new Date(timer.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">No timers yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Statistics
