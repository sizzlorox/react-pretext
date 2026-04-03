import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { usePreparedText } from '../../src/hooks/usePreparedText'

describe('usePreparedText', () => {
  it('returns null for empty text', () => {
    const { result } = renderHook(() => usePreparedText('', '16px sans-serif'))
    expect(result.current).toBeNull()
  })

  it('returns null for empty font', () => {
    const { result } = renderHook(() => usePreparedText('Hello', ''))
    expect(result.current).toBeNull()
  })

  it('returns a PreparedText for valid input', () => {
    const { result } = renderHook(() => usePreparedText('Hello world', '16px sans-serif'))
    expect(result.current).not.toBeNull()
  })

  it('memoizes: same object reference when inputs are unchanged', () => {
    const { result, rerender } = renderHook(() =>
      usePreparedText('Hello', '16px sans-serif')
    )
    const first = result.current
    rerender()
    expect(result.current).toBe(first)
  })

  it('re-prepares when text changes', () => {
    let text = 'Hello'
    const { result, rerender } = renderHook(() =>
      usePreparedText(text, '16px sans-serif')
    )
    const first = result.current
    text = 'World'
    rerender()
    expect(result.current).not.toBe(first)
  })

  it('re-prepares when font changes', () => {
    let font = '16px sans-serif'
    const { result, rerender } = renderHook(() =>
      usePreparedText('Hello', font)
    )
    const first = result.current
    font = '24px serif'
    rerender()
    expect(result.current).not.toBe(first)
  })

  it('does not re-prepare when options object reference changes but value is same', () => {
    let options = { whiteSpace: 'normal' as const }
    const { result, rerender } = renderHook(() =>
      usePreparedText('Hello', '16px sans-serif', options)
    )
    const first = result.current
    // New object reference, same value
    options = { whiteSpace: 'normal' }
    rerender()
    expect(result.current).toBe(first)
  })
})
