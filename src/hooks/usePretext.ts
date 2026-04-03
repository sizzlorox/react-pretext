import { usePreparedTextWithSegments } from './usePreparedTextWithSegments'
import { usePretextLayout } from './usePretextLayout'
import { usePretextLines } from './usePretextLines'
import type { PrepareOptions, LayoutResult, LayoutLinesResult } from '@chenglou/pretext'

export interface UsePretextOptions {
  /** CSS font string matching the element's font, e.g. `"16px Inter, sans-serif"` */
  font: string
  /** Container width in pixels. Pass `0` or `null` to skip layout. */
  maxWidth: number
  /** Line height in pixels */
  lineHeight: number
  /** Options forwarded to `prepare()` / `prepareWithSegments()` */
  prepareOptions?: PrepareOptions
  /** When `true`, returns `LayoutLinesResult` (includes per-line text). Default: `false` */
  withLines?: boolean
}

/**
 * Convenience hook that handles both phases of the pretext workflow.
 *
 * Internally uses `prepareWithSegments` (a superset of `prepare`) so the
 * result can be passed to either `layout` or `layoutWithLines` without
 * re-preparing.
 *
 * @example
 * ```tsx
 * // Height only (default)
 * const result = usePretext('Hello world', {
 *   font: '16px Inter',
 *   maxWidth: 300,
 *   lineHeight: 24,
 * })
 * // result: { lineCount: 1, height: 24 } | null
 *
 * // With per-line text
 * const result = usePretext('Hello world', {
 *   font: '16px Inter',
 *   maxWidth: 300,
 *   lineHeight: 24,
 *   withLines: true,
 * })
 * // result: { lineCount: 1, height: 24, lines: [...] } | null
 * ```
 */
export function usePretext(
  text: string,
  options: UsePretextOptions & { withLines: true }
): LayoutLinesResult | null
export function usePretext(
  text: string,
  options: UsePretextOptions & { withLines?: false }
): LayoutResult | null
export function usePretext(
  text: string,
  options: UsePretextOptions
): LayoutResult | LayoutLinesResult | null {
  const { font, maxWidth, lineHeight, prepareOptions, withLines = false } = options

  // Always use the segments variant — it's a superset and both layout calls
  // are pure arithmetic so running both is negligible overhead.
  const prepared = usePreparedTextWithSegments(text, font, prepareOptions)
  const layoutResult = usePretextLayout(prepared, maxWidth, lineHeight)
  const linesResult = usePretextLines(prepared, maxWidth, lineHeight)

  return withLines ? linesResult : layoutResult
}
