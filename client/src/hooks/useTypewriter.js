import { useState, useEffect } from 'react'

export function useTypewriter(phrases, typingSpeed = 55, pauseMs = 2200) {
  const [display, setDisplay] = useState('')
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!phrases?.length) return undefined

    const current = phrases[phraseIndex] || ''
    let timer

    if (!deleting) {
      if (charIndex < current.length) {
        timer = setTimeout(() => {
          setDisplay(current.slice(0, charIndex + 1))
          setCharIndex(prev => prev + 1)
        }, typingSpeed)
      } else {
        timer = setTimeout(() => setDeleting(true), pauseMs)
      }
    } else if (charIndex > 0) {
      timer = setTimeout(() => {
        setCharIndex(prev => prev - 1)
        setDisplay(current.slice(0, charIndex - 1))
      }, typingSpeed / 2)
    } else {
      setDeleting(false)
      setPhraseIndex(prev => (prev + 1) % phrases.length)
    }

    return () => clearTimeout(timer)
  }, [phrases, phraseIndex, charIndex, deleting, typingSpeed, pauseMs])

  return display
}
