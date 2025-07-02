// helper/vibration.ts

export const isVibrationSupported = 'vibrate' in navigator

/**
 * Triggers device vibration if supported
 * @param pattern - Vibration pattern (single duration or array of durations)
 */
export const vibrate = (pattern: number | number[]): void => {
  if (isVibrationSupported) {
    try {
      navigator.vibrate(pattern)
    } catch (error) {
      console.error('Vibration failed:', error)
    }
  } else {
    console.warn('Vibration API not supported in this browser')
  }
}

/**
 * Stops any ongoing vibration
 */
export const stopVibration = (): void => {
  if (isVibrationSupported) {
    navigator.vibrate(0)
  }
}
