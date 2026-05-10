import React, { useState } from 'react'
import { SESSION_TYPE_LABELS, SESSION_TYPE_COLORS, SESSION_TYPES } from '../hooks/useTimerManager'
import '../styles/TimerItem.css'

function TimerItem({ timer, onToggle, onPause, onResume, onSkip, onReset, onDelete, onTimeChange, onTypeChange, isActive }) {
  const [showSettings, setShowSettings] = useState(false)
  const [hours, setHours] = useState(Math.floor(timer.initialTime / 3600))
  const [minutes, setMinutes] = useState(Math.floor((timer.initialTime % 3600) / 60))
  const [seconds, setSeconds] = useState(timer.initialTime % 60)
  const [selectedType, setSelectedType] = useState(timer.sessionType)

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const handleSaveTime = () => {
    onTimeChange(timer.id, parseInt(hours), parseInt(minutes), parseInt(seconds))
    setShowSettings(false)
  }

  const handleTypeChange = (newType) => {
    setSelectedType(newType)
    onTypeChange(timer.id, newType)
  }

  const progress = ((timer.initialTime - timer.timeLeft) / timer.initialTime) * 100

  return (
    <div className={`timer-item ${isActive ? 'active' : ''}`} style={{ borderColor: SESSION_TYPE_COLORS[timer.sessionType] }}>
      <div className="timer-header">
        <div className="timer-type-label">{SESSION_TYPE_LABELS[timer.sessionType]}</div>
        <button className="btn-close" onClick={() => onDelete(timer.id)} title="Delete">×</button>
      </div>

      <div className="timer-display">
        <div className="time-value">{formatTime(timer.timeLeft)}</div>
        <svg className="progress-ring" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" fill="none" stroke="#e5e7eb" strokeWidth="4" />
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke={SESSION_TYPE_COLORS[timer.sessionType]}
            strokeWidth="4"
            strokeDasharray={`${339.29 * (progress / 100)} 339.29`}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 0.5s ease' }}
          />
        </svg>
      </div>

      <div className="timer-controls">
        {!timer.isRunning ? (
          <button 
            className="btn btn-play" 
            onClick={() => onToggle(timer.id)}
            title="Start/Play"
          >
            ▶ Play
          </button>
        ) : timer.isPaused ? (
          <button 
            className="btn btn-resume" 
            onClick={() => onResume(timer.id)}
            title="Resume"
          >
            ▶ Resume
          </button>
        ) : (
          <button 
            className="btn btn-pause" 
            onClick={() => onPause(timer.id)}
            title="Pause"
          >
            ⏸ Pause
          </button>
        )}

        <button 
          className="btn btn-skip" 
          onClick={() => onSkip(timer.id)}
          title="Skip"
        >
          ⏭ Skip
        </button>

        <button 
          className="btn btn-reset" 
          onClick={() => onReset(timer.id)}
          title="Reset"
        >
          ↻ Reset
        </button>
      </div>

      <div className="timer-settings-toggle">
        <button 
          className="btn-settings-icon"
          onClick={() => setShowSettings(!showSettings)}
          title="Settings"
        >
          ⚙ Settings
        </button>
        <span className="sessions-count">Sessions: {timer.sessionsCompleted}</span>
      </div>

      {showSettings && (
        <div className="timer-settings">
          <div className="settings-section">
            <h4>Time</h4>
            <div className="time-inputs">
              <div className="time-input">
                <label>Hours</label>
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                />
                <div className="input-buttons">
                  <button onClick={() => setHours(Math.min(23, parseInt(hours) + 1))}>+</button>
                  <button onClick={() => setHours(Math.max(0, parseInt(hours) - 1))}>−</button>
                </div>
              </div>

              <div className="time-input">
                <label>Minutes</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                />
                <div className="input-buttons">
                  <button onClick={() => setMinutes(Math.min(59, parseInt(minutes) + 1))}>+</button>
                  <button onClick={() => setMinutes(Math.max(0, parseInt(minutes) - 1))}>−</button>
                </div>
              </div>

              <div className="time-input">
                <label>Seconds</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={seconds}
                  onChange={(e) => setSeconds(e.target.value)}
                />
                <div className="input-buttons">
                  <button onClick={() => setSeconds(Math.min(59, parseInt(seconds) + 1))}>+</button>
                  <button onClick={() => setSeconds(Math.max(0, parseInt(seconds) - 1))}>−</button>
                </div>
              </div>
            </div>
          </div>

          <div className="settings-section">
            <h4>Session Type</h4>
            <div className="type-buttons">
              {Object.entries(SESSION_TYPES).map(([key, value]) => (
                <button
                  key={value}
                  className={`type-btn ${selectedType === value ? 'active' : ''}`}
                  style={{ 
                    backgroundColor: selectedType === value ? SESSION_TYPE_COLORS[value] : 'transparent',
                    borderColor: SESSION_TYPE_COLORS[value]
                  }}
                  onClick={() => handleTypeChange(value)}
                >
                  {SESSION_TYPE_LABELS[value]}
                </button>
              ))}
            </div>
          </div>

          <div className="settings-actions">
            <button className="btn btn-primary" onClick={handleSaveTime}>Save</button>
            <button className="btn btn-secondary" onClick={() => setShowSettings(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TimerItem
