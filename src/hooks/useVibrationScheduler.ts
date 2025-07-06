'use client'
import { useEffect } from 'react'

const useVibrationScheduler = (
  scheduledVibrations: { time: number; pattern: number[] }[]
) => {
  useEffect(() => {
    const vibrationTimers: ReturnType<typeof setTimeout>[] = []

    scheduledVibrations.forEach(({ time, pattern }) => {
      const delay = time - Date.now()
      if (delay > 0) {
        const timer = setTimeout(() => {
          if ('vibrate' in navigator) navigator.vibrate(pattern)
        }, delay)
        vibrationTimers.push(timer)
      }
    })

    return () => vibrationTimers.forEach(clearTimeout)
  }, [scheduledVibrations])
}

export default useVibrationScheduler
