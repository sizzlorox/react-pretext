import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { usePretext } from '../../src/hooks/usePretext'

const BASE_OPTS = { font: '16px sans-serif', maxWidth: 300, lineHeight: 24 }

describe('usePretext', () => {
  it('returns null for empty text', () => {
    const { result } = renderHook(() => usePretext('', BASE_OPTS))
    expect(result.current).toBeNull()
  })

  it('returns LayoutResult by default', () => {
    const { result } = renderHook(() => usePretext('Hello', BASE_OPTS))
    expect(result.current).not.toBeNull()
    expect(typeof result.current?.lineCount).toBe('number')
    expect(typeof result.current?.height).toBe('number')
    expect('lines' in (result.current ?? {})).toBe(false)
  })

  it('returns LayoutLinesResult when withLines is true', () => {
    const { result } = renderHook(() =>
      usePretext('Hello', { ...BASE_OPTS, withLines: true })
    )
    expect(result.current).not.toBeNull()
    expect('lines' in result.current!).toBe(true)
    expect(Array.isArray((result.current as { lines: unknown[] }).lines)).toBe(true)
  })

  it('returns null when maxWidth is zero', () => {
    const { result } = renderHook(() =>
      usePretext('Hello', { ...BASE_OPTS, maxWidth: 0 })
    )
    expect(result.current).toBeNull()
  })
})
