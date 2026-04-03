import { useMemo } from 'react'
import { layout } from '@chenglou/pretext'
import type { PreparedText, LayoutResult } from '@chenglou/pretext'

/**
 * Runs `layout()` on a prepared text object.
 *
 * Phase 2 of the pretext workflow: layout is pure arithmetic and extremely
 * fast. Returns `{ lineCount, height }`. Returns `null` if `prepared` is
 * `null` or `maxWidth` is not positive.
 *
 * @param prepared - Result of `usePreparedText` or `usePreparedTextWithSegments`
 * @param maxWidth - Container width in pixels
 * @param lineHeight - Line height in pixels
 */
export function usePretextLayout(
  prepared: PreparedText | null,
  maxWidth: number,
  lineHeight: number
): LayoutResult | null {
  return useMemo(() => {
    if (prepared === null || maxWidth <= 0) return null
    return layout(prepared, maxWidth, lineHeight)
  }, [prepared, maxWidth, lineHeight])
}
