import { act, renderHook } from '@testing-library/react'
import { useStatistics } from './useStatistics'

describe('useStatistics', () => {
  it('loads saved sessions from localStorage', () => {
    const savedSessions = [
      {
        id: 1,
        type: 'work',
        duration: 1500,
        timestamp: '2026-05-14T09:00:00.000Z',
        date: '5/14/2026'
      }
    ]
    localStorage.setItem('pomodoroSessions', JSON.stringify(savedSessions))

    const { result } = renderHook(() => useStatistics())

    expect(result.current.sessions).toEqual(savedSessions)
  })

  it('ignores malformed saved sessions', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    localStorage.setItem('pomodoroSessions', '{broken json')

    const { result } = renderHook(() => useStatistics())

    expect(result.current.sessions).toEqual([])
    expect(consoleError).toHaveBeenCalled()
  })

  it('adds a new session and updates daily and weekly aggregates', () => {
    vi.setSystemTime(new Date('2026-05-14T12:00:00.000Z'))

    const { result } = renderHook(() => useStatistics())

    act(() => {
      result.current.addSession('work', 1500)
      result.current.addSession('break', 300)
      result.current.addSession('work', 900)
    })

    expect(result.current.sessions).toHaveLength(3)
    expect(result.current.getTodayStats()).toEqual({
      totalSessions: 3,
      workSessions: 2,
      totalWorkTime: 2400
    })

    expect(result.current.getWeekStats()).toEqual({
      '5/14/2026': {
        work: 2,
        break: 1
      }
    })
  })

  it('keeps only the last 14 days of sessions after adding a new one', () => {
    vi.setSystemTime(new Date('2026-05-14T12:00:00.000Z'))
    localStorage.setItem(
      'pomodoroSessions',
      JSON.stringify([
        {
          id: 1,
          type: 'work',
          duration: 1500,
          timestamp: '2026-04-20T09:00:00.000Z',
          date: '4/20/2026'
        },
        {
          id: 2,
          type: 'work',
          duration: 1500,
          timestamp: '2026-05-10T09:00:00.000Z',
          date: '5/10/2026'
        }
      ])
    )

    const { result } = renderHook(() => useStatistics())

    act(() => {
      result.current.addSession('break', 300)
    })

    expect(result.current.sessions).toHaveLength(2)
    expect(result.current.sessions.map(session => session.id)).toEqual([2, expect.any(Number)])
  })
})
