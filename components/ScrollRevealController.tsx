'use client'

import { useEffect } from 'react'

export function ScrollRevealController() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-scroll-reveal]'))
    if (elements.length === 0) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion || !('IntersectionObserver' in window)) {
      elements.forEach((element) => {
        element.dataset.revealState = 'visible'
      })
      return
    }

    elements.forEach((element) => {
      element.dataset.revealState = 'pending'
    })

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        const element = entry.target as HTMLElement
        element.dataset.revealState = 'visible'
        observer.unobserve(element)
      })
    }, {
      rootMargin: '0px 0px -9% 0px',
      threshold: 0.12,
    })

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  return null
}
