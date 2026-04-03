import { useMemo, useRef } from 'react'
import { prepare } from '@chenglou/pretext'
import type { PreparedText, PrepareOptions } from '@chenglou/pretext'

/**
 * Memoizes `prepare()` from @chenglou/pretext.
 *
 * Phase 1 of the pretext workflow: preparation is relatively expensive and
 * should only run when text or font changes. Returns `null` if text or font
 * is empty.
 *
 * @param text - The text to prepare
 * @param font - CSS font string, e.g. `"16px Inter, sans-serif"`
 * @param options - Optional prepare options (e.g. `{ whiteSpace: 'pre-wrap' }`)
 */
export function usePreparedText(
  text: string,
  font: string,
  options?: PrepareOptions
): PreparedText | null {
  // Serialize options so an inline object like `{ whiteSpace: 'pre-wrap' }`
  // doesn't cause re-preparation on every render due to reference changes.
  const optionsKey = options !== undefined ? JSON.stringify(options) : ''
  // Store latest options in a ref so the memo closure always reads the current
  // value without needing `options` as a direct dependency.
  const optionsRef = useRef(options)
  optionsRef.current = options

  return useMemo(() => {
    if (!text || !font) return null
    return prepare(text, font, optionsRef.current)
  }, [text, font, optionsKey])
}
