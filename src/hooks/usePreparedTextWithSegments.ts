import { useMemo, useRef } from 'react'
import { prepareWithSegments } from '@chenglou/pretext'
import type { PreparedTextWithSegments, PrepareOptions } from '@chenglou/pretext'

/**
 * Memoizes `prepareWithSegments()` from @chenglou/pretext.
 *
 * Like `usePreparedText`, but returns a `PreparedTextWithSegments` which is
 * required by `layoutWithLines`, `layoutNextLine`, and `walkLineRanges`.
 * Use this when you need per-line text content.
 *
 * @param text - The text to prepare
 * @param font - CSS font string, e.g. `"16px Inter, sans-serif"`
 * @param options - Optional prepare options (e.g. `{ whiteSpace: 'pre-wrap' }`)
 */
export function usePreparedTextWithSegments(
  text: string,
  font: string,
  options?: PrepareOptions
): PreparedTextWithSegments | null {
  const optionsKey = options !== undefined ? JSON.stringify(options) : ''
  const optionsRef = useRef(options)
  optionsRef.current = options

  return useMemo(() => {
    if (!text || !font) return null
    return prepareWithSegments(text, font, optionsRef.current)
  }, [text, font, optionsKey])
}
