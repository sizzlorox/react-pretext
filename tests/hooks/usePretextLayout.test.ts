import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { usePreparedText } from '../../src/hooks/usePreparedText'
import { usePretextLayout } from '../../src/hooks/usePretextLayout'

describe('usePretextLayout', () => {
  it('returns null when prepared is null', () => {
    const { result } = renderHook(() => usePretextLayout(null, 300, 24))
    expect(result.current).toBeNull()
  })

  it('returns null when maxWidth is zero', () => {
    const { result } = renderHook(() => {
      const prepared = usePreparedText('Hello', '16px sans-serif')
      return usePretextLayout(prepared, 0, 24)
    })
    expect(result.current).toBeNull()
  })

  it('returns { lineCount, height } for valid input', () => {
    const { result } = renderHook(() => {
      const prepared = usePreparedText('Hello', '16px sans-serif')
      return usePretextLayout(prepared, 300, 24)
    })
    expect(result.current).not.toBeNull()
    expect(typeof result.current?.lineCount).toBe('number')
    expect(typeof result.current?.height).toBe('number')
    expect(result.current!.lineCount).toBeGreaterThan(0)
    expect(result.current!.height).toBeGreaterThan(0)
  })

  it('memoizes: same reference when inputs unchanged', () => {
    const { result, rerender } = renderHook(() => {
      const prepared = usePreparedText('Hello', '16px sans-serif')
      return usePretextLayout(prepared, 300, 24)
    })
    const first = result.current
    rerender()
    expect(result.current).toBe(first)
  })
})
