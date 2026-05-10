import React from 'react'
import '../styles/SessionManager.css'

function SessionManager() {
  return (
    <div className="session-manager">
      <h2>Pomodoro Technique</h2>
      <p className="description">
        25 minutes of focused work, followed by a 5-minute break. 
        After 4 cycles, take a 15-minute break.
      </p>
      <div className="technique-steps">
        <div className="step">
          <span className="step-number">1</span>
          <span className="step-text">Focus for 25 min</span>
        </div>
        <span className="arrow">→</span>
        <div className="step">
          <span className="step-number">2</span>
          <span className="step-text">Break 5 min</span>
        </div>
        <span className="arrow">→</span>
        <div className="step">
          <span className="step-number">3</span>
          <span className="step-text">Repeat 4x</span>
        </div>
        <span className="arrow">→</span>
        <div className="step">
          <span className="step-number">4</span>
          <span className="step-text">Long break 15 min</span>
        </div>
      </div>
    </div>
  )
}

export default SessionManager
