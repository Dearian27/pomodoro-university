import { useState, useCallback } from 'react'

// Типи сеансів
export const SESSION_TYPES = {
  WORK: 'work',
  REST: 'rest',
  FOCUS: 'focus',
  ENTERTAINMENT: 'entertainment',
  MEDITATION: 'meditation'
}

export const SESSION_TYPE_LABELS = {
  work: 'Work',
  rest: 'Rest',
  focus: 'Focus',
  entertainment: 'Entertainment',
  meditation: 'Meditation'
}

export const SESSION_TYPE_COLORS = {
  work: '#10b981',
  rest: '#3b82f6',
  focus: '#f59e0b',
  entertainment: '#ec4899',
  meditation: '#8b5cf6'
}

export function useTimerManager() {
  const [timers, setTimers] = useState(() => {
    const saved = localStorage.getItem('pomodoroTimers')
    return saved ? JSON.parse(saved) : []
  })

  const [activeTimerId, setActiveTimerId] = useState(null)

  // Додати новий таймер
  const addTimer = useCallback((sessionType = SESSION_TYPES.WORK, hours = 0, minutes = 25, seconds = 0) => {
    const newTimer = {
      id: Date.now(),
      sessionType,
      initialTime: hours * 3600 + minutes * 60 + seconds,
      timeLeft: hours * 3600 + minutes * 60 + seconds,
      isRunning: false,
      isPaused: false,
      createdAt: new Date().toISOString(),
      sessionsCompleted: 0
    }
    
    const updated = [...timers, newTimer]
    setTimers(updated)
    localStorage.setItem('pomodoroTimers', JSON.stringify(updated))
    setActiveTimerId(newTimer.id)
    return newTimer.id
  }, [timers])

  // Видалити таймер
  const deleteTimer = useCallback((timerId) => {
    const updated = timers.filter(t => t.id !== timerId)
    setTimers(updated)
    localStorage.setItem('pomodoroTimers', JSON.stringify(updated))
    if (activeTimerId === timerId) {
      setActiveTimerId(updated.length > 0 ? updated[0].id : null)
    }
  }, [timers, activeTimerId])

  // Запустити/паузувати таймер
  const toggleTimer = useCallback((timerId) => {
    setTimers(prev => {
      const updated = prev.map(t => {
        if (t.id === timerId) {
          return {
            ...t,
            isRunning: !t.isRunning,
            isPaused: false
          }
        }
        return { ...t, isRunning: false, isPaused: false } // Зупинити інші
      })
      localStorage.setItem('pomodoroTimers', JSON.stringify(updated))
      return updated
    })
    setActiveTimerId(timerId)
  }, [])

  // Паузувати таймер
  const pauseTimer = useCallback((timerId) => {
    setTimers(prev => {
      const updated = prev.map(t =>
        t.id === timerId ? { ...t, isRunning: false, isPaused: true } : t
      )
      localStorage.setItem('pomodoroTimers', JSON.stringify(updated))
      return updated
    })
  }, [])

  // Возобновити таймер
  const resumeTimer = useCallback((timerId) => {
    setTimers(prev => {
      const updated = prev.map(t =>
        t.id === timerId ? { ...t, isRunning: true, isPaused: false } : t
      )
      localStorage.setItem('pomodoroTimers', JSON.stringify(updated))
      return updated
    })
  }, [])

  // Скипнути таймер
  const skipTimer = useCallback((timerId) => {
    setTimers(prev => {
      const updated = prev.map(t => {
        if (t.id === timerId) {
          return {
            ...t,
            timeLeft: 0,
            isRunning: false,
            isPaused: false
          }
        }
        return t
      })
      localStorage.setItem('pomodoroTimers', JSON.stringify(updated))
      return updated
    })
  }, [])

  // Скинути таймер
  const resetTimer = useCallback((timerId) => {
    setTimers(prev => {
      const updated = prev.map(t =>
        t.id === timerId
          ? { ...t, timeLeft: t.initialTime, isRunning: false, isPaused: false }
          : t
      )
      localStorage.setItem('pomodoroTimers', JSON.stringify(updated))
      return updated
    })
  }, [])

  // Змінити час таймера
  const updateTimerTime = useCallback((timerId, hours, minutes, seconds) => {
    const newTime = hours * 3600 + minutes * 60 + seconds
    setTimers(prev => {
      const updated = prev.map(t =>
        t.id === timerId
          ? { ...t, initialTime: newTime, timeLeft: newTime, isRunning: false, isPaused: false }
          : t
      )
      localStorage.setItem('pomodoroTimers', JSON.stringify(updated))
      return updated
    })
  }, [])

  // Зменшити час на 1 секунду
  const decrementTime = useCallback((timerId) => {
    setTimers(prev => {
      const updated = prev.map(t => {
        if (t.id === timerId && t.isRunning && !t.isPaused) {
          if (t.timeLeft <= 0) {
            // Таймер закінчився
            playNotification(t.sessionType)
            return {
              ...t,
              timeLeft: 0,
              isRunning: false,
              sessionsCompleted: t.sessionsCompleted + 1
            }
          }
          return { ...t, timeLeft: t.timeLeft - 1 }
        }
        return t
      })
      localStorage.setItem('pomodoroTimers', JSON.stringify(updated))
      return updated
    })
  }, [])

  // Змінити тип сеансу
  const updateSessionType = useCallback((timerId, newType) => {
    setTimers(prev => {
      const updated = prev.map(t =>
        t.id === timerId ? { ...t, sessionType: newType } : t
      )
      localStorage.setItem('pomodoroTimers', JSON.stringify(updated))
      return updated
    })
  }, [])

  const getTimer = useCallback((timerId) => {
    return timers.find(t => t.id === timerId)
  }, [timers])

  const getActiveTimer = useCallback(() => {
    return timers.find(t => t.id === activeTimerId) || timers[0]
  }, [timers, activeTimerId])

  return {
    timers,
    activeTimerId,
    setActiveTimerId,
    addTimer,
    deleteTimer,
    toggleTimer,
    pauseTimer,
    resumeTimer,
    skipTimer,
    resetTimer,
    updateTimerTime,
    updateSessionType,
    decrementTime,
    getTimer,
    getActiveTimer
  }
}

function playNotification(sessionType) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('Pomodoro Timer', {
      body: `${SESSION_TYPE_LABELS[sessionType]} completed!`,
      icon: '🍅'
    })
  }

  // Web Audio API звук
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.frequency.value = 800
    oscillator.type = 'sine'
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.5)
  } catch (e) {
    console.log('Audio not available')
  }
}
