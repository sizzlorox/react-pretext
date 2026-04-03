import { useState, useEffect, type RefObject } from 'react'

/**
 * Tracks the pixel width of a DOM element using `ResizeObserver`.
 *
 * Returns `null` on first render (before measurement), making it SSR-safe
 * with no hydration mismatch. Updates whenever the element is resized.
 *
 * @param ref - A React ref attached to the element to measure
 *
 * @example
 * ```tsx
 * const ref = useRef<HTMLDivElement>(null)
 * const width = usePretextContainerWidth(ref)
 *
 * const result = usePretext(text, {
 *   font: '16px Inter',
 *   maxWidth: width ?? 0,
 *   lineHeight: 24,
 * })
 *
 * return <div ref={ref}>...</div>
 * ```
 */
export function usePretextContainerWidth(
  ref: RefObject<HTMLElement | null>
): number | null {
  const [width, setWidth] = useState<number | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Read immediately on mount so we don't wait for the first ResizeObserver tick
    setWidth(el.getBoundingClientRect().width)

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) return

      // Prefer contentBoxSize for sub-pixel accuracy; fall back to contentRect
      const w =
        entry.contentBoxSize && entry.contentBoxSize[0] !== undefined
          ? entry.contentBoxSize[0].inlineSize
          : entry.contentRect.width

      setWidth(w)
    })

    observer.observe(el)
    return () => observer.disconnect()
  }, [ref])

  return width
}
