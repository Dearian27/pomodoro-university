import React, { useState, useEffect } from 'react'
import { useTimer } from '../hooks/useTimer'
import '../styles/Settings.css'

function Settings({ onClose }) {
  const { settings, updateSettings } = useTimer()
  const [formData, setFormData] = useState(settings)
  const [soundEnabled, setSoundEnabled] = useState(
    localStorage.getItem('soundEnabled') !== 'false'
  )

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: parseInt(value)
    }))
  }

  const handleSoundToggle = () => {
    const newState = !soundEnabled
    setSoundEnabled(newState)
    localStorage.setItem('soundEnabled', newState)
  }

  const handleSave = () => {
    updateSettings(formData)
    onClose()
  }

  return (
    <div className="settings-panel">
      <div className="settings-header">
        <h2>Settings</h2>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>

      <div className="settings-content">
        <div className="setting-group">
          <label htmlFor="workDuration">Work Duration (minutes)</label>
          <input
            id="workDuration"
            type="number"
            name="workDuration"
            min="1"
            max="60"
            value={formData.workDuration}
            onChange={handleChange}
          />
        </div>

        <div className="setting-group">
          <label htmlFor="shortBreak">Short Break (minutes)</label>
          <input
            id="shortBreak"
            type="number"
            name="shortBreak"
            min="1"
            max="30"
            value={formData.shortBreak}
            onChange={handleChange}
          />
        </div>

        <div className="setting-group">
          <label htmlFor="longBreak">Long Break (minutes)</label>
          <input
            id="longBreak"
            type="number"
            name="longBreak"
            min="1"
            max="60"
            value={formData.longBreak}
            onChange={handleChange}
          />
        </div>

        <div className="setting-group toggle">
          <label>Sound Notifications</label>
          <button 
            className={`toggle-switch ${soundEnabled ? 'enabled' : ''}`}
            onClick={handleSoundToggle}
          >
            {soundEnabled ? '🔊 On' : '🔇 Off'}
          </button>
        </div>

        <div className="settings-actions">
          <button className="btn btn-primary" onClick={handleSave}>
            Save Settings
          </button>
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default Settings
