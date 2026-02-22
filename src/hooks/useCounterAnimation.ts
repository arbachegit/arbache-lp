'use client'

import { useEffect, useState } from 'react'

export function useCounterAnimation(
  target: number,
  isVisible: boolean,
  duration = 2000
) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isVisible) return

    const increment = Math.max(1, Math.floor(target / (duration / 30)))
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        current = target
        clearInterval(timer)
      }
      setCount(current)
    }, 30)

    return () => clearInterval(timer)
  }, [isVisible, target, duration])

  return count
}
