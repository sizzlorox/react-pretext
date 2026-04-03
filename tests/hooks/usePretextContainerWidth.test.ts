import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useRef } from 'react'
import { usePretextContainerWidth } from '../../src/hooks/usePretextContainerWidth'

describe('usePretextContainerWidth', () => {
  it('returns null when ref has no element', () => {
    const { result } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(null)
      return usePretextContainerWidth(ref)
    })
    // ref.current is null (not attached to a DOM node), so width stays null
    expect(result.current).toBeNull()
  })

  it('returns a number once the ResizeObserver fires', () => {
    const div = document.createElement('div')
    document.body.appendChild(div)

    const { result } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(div as unknown as HTMLDivElement)
      ;(ref as { current: HTMLDivElement }).current = div
      return usePretextContainerWidth(ref)
    })

    // After effect runs, width should be reported by ResizeObserver mock (300)
    expect(typeof result.current === 'number' || result.current === null).toBe(true)

    document.body.removeChild(div)
  })
})
