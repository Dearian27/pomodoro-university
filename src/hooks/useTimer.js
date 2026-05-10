import { useState, useEffect, useCallback } from 'react'

export function useTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [sessionType, setSessionType] = useState('work') // 'work' or 'break'
  const [sessionsCompleted, setSessionsCompleted] = useState(0)
  const [settings, setSettings] = useState({
    workDuration: 25,
    shortBreak: 5,
    longBreak: 15
  })

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('pomodoroSettings')
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings)
      setSettings(parsed)
      setTimeLeft(parsed.workDuration * 60)
    }
  }, [])

  // Main timer loop
  useEffect(() => {
    if (!isRunning || isPaused) return

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Timer finished
          playNotification()
          handleSessionComplete()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, isPaused])

  const handleSessionComplete = useCallback(() => {
    if (sessionType === 'work') {
      setSessionsCompleted(prev => prev + 1)
      
      // Determine next break type
      const nextSessions = (sessionsCompleted + 1) % 4
      if (nextSessions === 0) {
        // Long break after 4 sessions
        setSessionType('longBreak')
        setTimeLeft(settings.longBreak * 60)
      } else {
        // Short break
        setSessionType('break')
        setTimeLeft(settings.shortBreak * 60)
      }
    } else {
      // Break finished, back to work
      setSessionType('work')
      setTimeLeft(settings.workDuration * 60)
    }
    
    setIsRunning(false)
    setIsPaused(false)
  }, [sessionType, sessionsCompleted, settings])

  const playNotification = useCallback(() => {
    // Browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Pomodoro Timer', {
        body: sessionType === 'work' 
          ? 'Work session completed! Time for a break.' 
          : 'Break finished! Back to work.',
        icon: '🍅'
      })
    }

    // Play sound
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
  }, [sessionType])

  const start = useCallback(() => {
    setIsRunning(true)
    setIsPaused(false)
  }, [])

  const pause = useCallback(() => {
    setIsPaused(true)
  }, [])

  const resume = useCallback(() => {
    setIsPaused(false)
  }, [])

  const reset = useCallback(() => {
    setIsRunning(false)
    setIsPaused(false)
    setSessionType('work')
    setTimeLeft(settings.workDuration * 60)
  }, [settings])

  const updateSettings = useCallback((newSettings) => {
    setSettings(newSettings)
    localStorage.setItem('pomodoroSettings', JSON.stringify(newSettings))
    
    if (sessionType === 'work') {
      setTimeLeft(newSettings.workDuration * 60)
    } else if (sessionType === 'break') {
      setTimeLeft(newSettings.shortBreak * 60)
    } else {
      setTimeLeft(newSettings.longBreak * 60)
    }
  }, [sessionType])

  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission()
    }
  }, [])

  return {
    timeLeft,
    isRunning,
    isPaused,
    sessionType,
    sessionsCompleted,
    settings,
    start,
    pause,
    resume,
    reset,
    updateSettings,
    requestNotificationPermission
  }
}
