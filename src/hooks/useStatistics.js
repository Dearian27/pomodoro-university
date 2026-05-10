import { useState, useEffect, useCallback } from 'react'

export function useStatistics() {
  const [sessions, setSessions] = useState([])

  // Load sessions from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('pomodoroSessions')
    if (saved) {
      try {
        setSessions(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load sessions:', e)
      }
    }
  }, [])

  const addSession = useCallback((type, duration) => {
    const newSession = {
      id: Date.now(),
      type, // 'work' or 'break'
      duration,
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString('en-US')
    }

    setSessions(prev => {
      const updated = [...prev, newSession]
      // Keep only last 14 days
      const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US')
      const filtered = updated.filter(s => {
        const sessionDate = new Date(s.date)
        const twoWeeksDate = new Date(twoWeeksAgo)
        return sessionDate >= twoWeeksDate
      })
      localStorage.setItem('pomodoroSessions', JSON.stringify(filtered))
      return filtered
    })
  }, [])

  const getTodayStats = useCallback(() => {
    const today = new Date().toLocaleDateString('en-US')
    const todaySessions = sessions.filter(s => s.date === today)
    return {
      totalSessions: todaySessions.length,
      workSessions: todaySessions.filter(s => s.type === 'work').length,
      totalWorkTime: todaySessions
        .filter(s => s.type === 'work')
        .reduce((sum, s) => sum + s.duration, 0)
    }
  }, [sessions])

  const getWeekStats = useCallback(() => {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const weekSessions = sessions.filter(s => new Date(s.timestamp) >= weekAgo)
    
    const stats = {}
    weekSessions.forEach(session => {
      if (!stats[session.date]) {
        stats[session.date] = { work: 0, break: 0 }
      }
      if (session.type === 'work') {
        stats[session.date].work += 1
      } else {
        stats[session.date].break += 1
      }
    })

    return stats
  }, [sessions])

  return {
    sessions,
    addSession,
    getTodayStats,
    getWeekStats
  }
}
