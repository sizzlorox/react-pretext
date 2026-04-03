import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { usePreparedTextWithSegments } from '../../src/hooks/usePreparedTextWithSegments'
import { usePretextLines } from '../../src/hooks/usePretextLines'

describe('usePretextLines', () => {
  it('returns null when prepared is null', () => {
    const { result } = renderHook(() => usePretextLines(null, 300, 24))
    expect(result.current).toBeNull()
  })

  it('returns null when maxWidth is zero', () => {
    const { result } = renderHook(() => {
      const prepared = usePreparedTextWithSegments('Hello', '16px sans-serif')
      return usePretextLines(prepared, 0, 24)
    })
    expect(result.current).toBeNull()
  })

  it('returns { lineCount, height, lines } for valid input', () => {
    const { result } = renderHook(() => {
      const prepared = usePreparedTextWithSegments('Hello world', '16px sans-serif')
      return usePretextLines(prepared, 300, 24)
    })
    expect(result.current).not.toBeNull()
    expect(Array.isArray(result.current?.lines)).toBe(true)
    expect(result.current!.lines.length).toBeGreaterThan(0)
    result.current!.lines.forEach((line) => {
      expect(typeof line.text).toBe('string')
      expect(typeof line.width).toBe('number')
    })
  })
})
