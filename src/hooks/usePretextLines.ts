import { useMemo } from 'react'
import { layoutWithLines } from '@chenglou/pretext'
import type { PreparedTextWithSegments, LayoutLinesResult } from '@chenglou/pretext'

/**
 * Runs `layoutWithLines()` on a prepared text object.
 *
 * Returns `{ lineCount, height, lines }` where each line has `{ text, width,
 * start, end }`. Use this when you need per-line text content for custom
 * rendering. Requires `PreparedTextWithSegments` — use
 * `usePreparedTextWithSegments`.
 *
 * @param prepared - Result of `usePreparedTextWithSegments`
 * @param maxWidth - Container width in pixels
 * @param lineHeight - Line height in pixels
 */
export function usePretextLines(
  prepared: PreparedTextWithSegments | null,
  maxWidth: number,
  lineHeight: number
): LayoutLinesResult | null {
  return useMemo(() => {
    if (prepared === null || maxWidth <= 0) return null
    return layoutWithLines(prepared, maxWidth, lineHeight)
  }, [prepared, maxWidth, lineHeight])
}
