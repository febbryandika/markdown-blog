import { useEffect, useState } from 'react'

/**
 * A thin scroll-progress bar pinned to the top of the viewport. Decorative
 * (aria-hidden); the width maps directly to scroll position with no easing,
 * so it's comfortable with reduced-motion preferences.
 */
export function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    function update() {
      const el = document.documentElement
      const scrollable = el.scrollHeight - el.clientHeight
      setProgress(scrollable > 0 ? (el.scrollTop / scrollable) * 100 : 0)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <div className="fixed inset-x-0 top-0 z-50 h-0.5" aria-hidden="true">
      <div className="h-full bg-brand" style={{ width: `${progress}%` }} />
    </div>
  )
}
