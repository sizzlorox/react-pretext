import { useRef, type CSSProperties, type HTMLAttributes } from 'react'
import type { PrepareOptions } from '@chenglou/pretext'
import { usePreparedTextWithSegments } from '../hooks/usePreparedTextWithSegments'
import { usePretextLines } from '../hooks/usePretextLines'
import { usePretextContainerWidth } from '../hooks/usePretextContainerWidth'

export interface PretextTextProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** The text content to display */
  text: string
  /**
   * CSS font string that matches the element's computed font.
   * Must be exact — e.g. `"16px Inter, sans-serif"`.
   * This is used for text measurement, so it must match what the browser renders.
   */
  font: string
  /** Line height in pixels. Should match the element's actual rendered line height. */
  lineHeight: number
  /** Options forwarded to `prepareWithSegments()` */
  prepareOptions?: PrepareOptions
  /** CSS class applied to each line `<span>` */
  lineClassName?: string
  /** Inline style applied to each line `<span>` */
  lineStyle?: CSSProperties
}

/**
 * A drop-in component that renders text using pretext for measurement.
 *
 * Measures its own container width via `ResizeObserver` and uses pretext to
 * compute line breaks without triggering DOM reflows. Before the container
 * width is known (first render / SSR), the raw text is rendered invisibly to
 * establish the natural container size.
 *
 * @example
 * ```tsx
 * <PretextText
 *   text="The quick brown fox jumps over the lazy dog."
 *   font="16px Georgia, serif"
 *   lineHeight={24}
 *   style={{ width: '300px' }}
 * />
 * ```
 */
export function PretextText({
  text,
  font,
  lineHeight,
  prepareOptions,
  lineClassName,
  lineStyle,
  style,
  ...divProps
}: PretextTextProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const width = usePretextContainerWidth(containerRef)
  const prepared = usePreparedTextWithSegments(text, font, prepareOptions)
  const result = usePretextLines(prepared, width ?? 0, lineHeight)

  return (
    <div ref={containerRef} style={style} {...divProps}>
      {result !== null && width !== null ? (
        result.lines.map((line, i) => (
          <span
            key={i}
            className={lineClassName}
            style={{ display: 'block', height: lineHeight, ...lineStyle }}
          >
            {line.text}
          </span>
        ))
      ) : (
        // Render text invisibly until width is known so the container can
        // establish its natural size before the ResizeObserver fires.
        <span aria-hidden style={{ visibility: 'hidden' }}>
          {text}
        </span>
      )}
    </div>
  )
}
