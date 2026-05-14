import { act, renderHook } from '@testing-library/react'
import { SESSION_TYPES, useTimerManager } from './useTimerManager'

function mockBrowserApis() {
  const oscillator = {
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    frequency: { value: 0 },
    type: 'sine'
  }

  const gainNode = {
    connect: vi.fn(),
    gain: {
      setValueAtTime: vi.fn(),
      exponentialRampToValueAtTime: vi.fn()
    }
  }

  class MockAudioContext {
    constructor() {
      this.currentTime = 0
      this.destination = {}
    }

    createOscillator() {
      return oscillator
    }

    createGain() {
      return gainNode
    }
  }

  vi.stubGlobal('AudioContext', MockAudioContext)
  vi.stubGlobal('webkitAudioContext', MockAudioContext)
  vi.stubGlobal('Notification', vi.fn())
  Notification.permission = 'granted'

  return { oscillator, gainNode }
}

describe('useTimerManager', () => {
  beforeEach(() => {
    mockBrowserApis()
  })

  it('loads persisted timers and returns the first one as active by default', () => {
    const savedTimers = [
      {
        id: 101,
        sessionType: SESSION_TYPES.WORK,
        initialTime: 1500,
        timeLeft: 1200,
        isRunning: false,
        isPaused: false,
        createdAt: '2026-05-14T09:00:00.000Z',
        sessionsCompleted: 1
      }
    ]
    localStorage.setItem('pomodoroTimers', JSON.stringify(savedTimers))

    const { result } = renderHook(() => useTimerManager())

    expect(result.current.timers).toEqual(savedTimers)
    expect(result.current.getActiveTimer()).toEqual(savedTimers[0])
  })

  it('adds a timer, persists it, and marks it active', () => {
    vi.spyOn(Date, 'now').mockReturnValue(4242)

    const { result } = renderHook(() => useTimerManager())

    act(() => {
      result.current.addTimer(SESSION_TYPES.FOCUS, 1, 2, 3)
    })

    expect(result.current.activeTimerId).toBe(4242)
    expect(result.current.timers).toHaveLength(1)
    expect(result.current.timers[0]).toMatchObject({
      id: 4242,
      sessionType: SESSION_TYPES.FOCUS,
      initialTime: 3723,
      timeLeft: 3723,
      isRunning: false,
      isPaused: false,
      sessionsCompleted: 0
    })
    expect(JSON.parse(localStorage.getItem('pomodoroTimers'))).toEqual(result.current.timers)
  })

  it('runs only one timer at a time when toggling', () => {
    localStorage.setItem(
      'pomodoroTimers',
      JSON.stringify([
        {
          id: 1,
          sessionType: SESSION_TYPES.WORK,
          initialTime: 1500,
          timeLeft: 1500,
          isRunning: false,
          isPaused: false,
          createdAt: '2026-05-14T09:00:00.000Z',
          sessionsCompleted: 0
        },
        {
          id: 2,
          sessionType: SESSION_TYPES.REST,
          initialTime: 300,
          timeLeft: 300,
          isRunning: false,
          isPaused: false,
          createdAt: '2026-05-14T09:10:00.000Z',
          sessionsCompleted: 0
        }
      ])
    )

    const { result } = renderHook(() => useTimerManager())

    act(() => {
      result.current.toggleTimer(1)
    })

    expect(result.current.timers.find(timer => timer.id === 1)).toMatchObject({
      isRunning: true,
      isPaused: false
    })
    expect(result.current.timers.find(timer => timer.id === 2)).toMatchObject({
      isRunning: false,
      isPaused: false
    })

    act(() => {
      result.current.toggleTimer(2)
    })

    expect(result.current.timers.find(timer => timer.id === 1)).toMatchObject({
      isRunning: false,
      isPaused: false
    })
    expect(result.current.timers.find(timer => timer.id === 2)).toMatchObject({
      isRunning: true,
      isPaused: false
    })
  })

  it('decrements running timers and completes a session when time reaches zero', () => {
    localStorage.setItem(
      'pomodoroTimers',
      JSON.stringify([
        {
          id: 9,
          sessionType: SESSION_TYPES.WORK,
          initialTime: 2,
          timeLeft: 1,
          isRunning: true,
          isPaused: false,
          createdAt: '2026-05-14T09:00:00.000Z',
          sessionsCompleted: 0
        }
      ])
    )

    const { result } = renderHook(() => useTimerManager())

    act(() => {
      result.current.decrementTime(9)
    })

    expect(result.current.getTimer(9)).toMatchObject({
      timeLeft: 0,
      isRunning: true,
      sessionsCompleted: 0
    })

    act(() => {
      result.current.decrementTime(9)
    })

    expect(result.current.getTimer(9)).toMatchObject({
      timeLeft: 0,
      isRunning: false,
      isPaused: false,
      sessionsCompleted: 1
    })
    expect(Notification).toHaveBeenCalledTimes(1)
  })

  it('resets and retimes a timer', () => {
    localStorage.setItem(
      'pomodoroTimers',
      JSON.stringify([
        {
          id: 11,
          sessionType: SESSION_TYPES.WORK,
          initialTime: 1500,
          timeLeft: 900,
          isRunning: true,
          isPaused: false,
          createdAt: '2026-05-14T09:00:00.000Z',
          sessionsCompleted: 2
        }
      ])
    )

    const { result } = renderHook(() => useTimerManager())

    act(() => {
      result.current.resetTimer(11)
    })

    expect(result.current.getTimer(11)).toMatchObject({
      timeLeft: 1500,
      isRunning: false,
      isPaused: false
    })

    act(() => {
      result.current.updateTimerTime(11, 0, 10, 5)
    })

    expect(result.current.getTimer(11)).toMatchObject({
      initialTime: 605,
      timeLeft: 605,
      isRunning: false,
      isPaused: false
    })
  })
})
