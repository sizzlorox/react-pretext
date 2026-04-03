# react-pretext

React hooks and components for [`@chenglou/pretext`](https://github.com/chenglou/pretext) — high-performance text measurement and layout without DOM reflows.

**[Live Demo](https://sizzlorox.github.io/react-pretext/)**

## What is this?

Pretext measures and lays out multiline text using pure arithmetic, avoiding the expensive DOM operations (`getBoundingClientRect`, `offsetHeight`) that cause layout reflow. This library wraps its two-phase API in idiomatic React hooks and a ready-to-use component.

## Install

```sh
npm install react-pretext @chenglou/pretext
```

Requires React 18+.

## Quick start

```tsx
import { PretextText } from 'react-pretext'

function App() {
  return (
    <PretextText
      text="The quick brown fox jumps over the lazy dog."
      font="16px Georgia, serif"
      lineHeight={24}
      style={{ width: '300px' }}
    />
  )
}
```

Or with the hooks directly:

```tsx
import { usePretext } from 'react-pretext'

function MyText({ text, maxWidth }: { text: string; maxWidth: number }) {
  const result = usePretext(text, {
    font: '16px Inter, sans-serif',
    maxWidth,
    lineHeight: 24,
  })

  return <div style={{ height: result?.height }}>{text}</div>
}
```

## API

### `usePretext(text, options)` — combined convenience hook

The main hook for most use cases. Handles both the prepare and layout phases internally.

```ts
usePretext(text: string, options: UsePretextOptions): LayoutResult | null
usePretext(text: string, options: UsePretextOptions & { withLines: true }): LayoutLinesResult | null
```

**Options:**

| Option | Type | Description |
|--------|------|-------------|
| `font` | `string` | CSS font string, e.g. `"16px Inter, sans-serif"` |
| `maxWidth` | `number` | Container width in pixels |
| `lineHeight` | `number` | Line height in pixels |
| `prepareOptions` | `PrepareOptions?` | e.g. `{ whiteSpace: 'pre-wrap' }` |
| `withLines` | `boolean?` | When `true`, returns per-line text data |

Returns `null` when text/font is empty or `maxWidth` is `0`.

---

### `usePretextContainerWidth(ref)` — measure container width

```ts
usePretextContainerWidth(ref: RefObject<HTMLElement | null>): number | null
```

Tracks an element's pixel width via `ResizeObserver`. Returns `null` until the first measurement (SSR-safe — no hydration mismatch). Use this to feed a responsive container width into `usePretext`.

```tsx
const ref = useRef<HTMLDivElement>(null)
const width = usePretextContainerWidth(ref)

const result = usePretext(text, {
  font: '16px Inter, sans-serif',
  maxWidth: width ?? 0,
  lineHeight: 24,
})

return <div ref={ref}>...</div>
```

---

### Granular hooks

For more control, use the lower-level hooks directly.

#### `usePreparedText(text, font, options?)` — Phase 1

Memoizes `prepare()`. Returns `PreparedText | null`.

```ts
usePreparedText(text: string, font: string, options?: PrepareOptions): PreparedText | null
```

#### `usePreparedTextWithSegments(text, font, options?)` — Phase 1 (with lines)

Memoizes `prepareWithSegments()`. Required for `usePretextLines`. Returns `PreparedTextWithSegments | null`.

```ts
usePreparedTextWithSegments(text: string, font: string, options?: PrepareOptions): PreparedTextWithSegments | null
```

#### `usePretextLayout(prepared, maxWidth, lineHeight)` — Phase 2

Runs `layout()`. Returns `{ lineCount, height } | null`.

```ts
usePretextLayout(prepared: PreparedText | null, maxWidth: number, lineHeight: number): LayoutResult | null
```

#### `usePretextLines(prepared, maxWidth, lineHeight)` — Phase 2 (with lines)

Runs `layoutWithLines()`. Returns `{ lineCount, height, lines[] } | null`.

```ts
usePretextLines(prepared: PreparedTextWithSegments | null, maxWidth: number, lineHeight: number): LayoutLinesResult | null
```

**Example — virtualized list:**

```tsx
import { usePreparedText, usePretextLayout } from 'react-pretext'

function ListItem({ text, font, containerWidth }: Props) {
  // Memoized: re-runs only when text or font changes
  const prepared = usePreparedText(text, font)

  // Pure arithmetic: safe to call every render
  const layout = usePretextLayout(prepared, containerWidth, 20)

  return <div style={{ height: layout?.height ?? 'auto' }}>{text}</div>
}
```

**Example — custom rendering per line:**

```tsx
import { usePreparedTextWithSegments, usePretextLines } from 'react-pretext'

function HighlightedText({ text, font, width, lineHeight, searchTerm }: Props) {
  const prepared = usePreparedTextWithSegments(text, font)
  const result = usePretextLines(prepared, width, lineHeight)

  return (
    <div>
      {result?.lines.map((line) => (
        <div key={line.start.segmentIndex} style={{ height: lineHeight }}>
          {line.text.includes(searchTerm) ? <mark>{line.text}</mark> : line.text}
        </div>
      ))}
    </div>
  )
}
```

---

### `<PretextText>` — drop-in component

Renders text using pretext layout. Measures its own container width automatically.

| Prop | Type | Description |
|------|------|-------------|
| `text` | `string` | Text to display |
| `font` | `string` | CSS font string (must match the rendered font) |
| `lineHeight` | `number` | Line height in pixels |
| `prepareOptions` | `PrepareOptions?` | Forwarded to `prepareWithSegments` |
| `lineClassName` | `string?` | Class applied to each line `<span>` |
| `lineStyle` | `CSSProperties?` | Style applied to each line `<span>` |
| ...rest | `HTMLAttributes<HTMLDivElement>` | Forwarded to the container `<div>` |

> **Note:** The `font` prop must exactly match the element's computed CSS font. The browser renders text using the computed font; pretext measures using the `font` prop. A mismatch causes incorrect line breaks.

---

### Low-level layout primitives

Re-exported from `@chenglou/pretext` for advanced use cases where you need to lay out text with a varying width per line (e.g. flowing text around shapes).

#### `layoutNextLine(prepared, cursor, maxWidth)`

Lays out a single line starting at `cursor`, constrained to `maxWidth`. Returns the line's text and an updated cursor pointing to the next character, or `null` when the text is exhausted.

```ts
import { layoutNextLine } from 'react-pretext'
import type { LayoutCursor } from 'react-pretext'

let cursor: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 }

while (true) {
  const line = layoutNextLine(prepared, cursor, maxWidthForThisLine)
  if (!line) break
  // line.text — the text for this line
  // line.end  — cursor to pass to the next call
  cursor = line.end
}
```

#### `walkLineRanges(prepared, cursor, maxWidth, callback)`

Iterates over grapheme ranges within a single line, calling `callback` for each segment. Useful for rendering inline highlights or mixed styles without splitting the string manually.

---

### Utilities

Re-exported from `@chenglou/pretext`:

```ts
import { clearCache, setLocale } from 'react-pretext'

setLocale('ja-JP') // Affects word-break rules for CJK, Arabic, etc.
clearCache()       // Release measurement caches (e.g. after locale change)
```

---

## How it works

Pretext uses a two-phase design:

1. **Prepare** (once per text+font): Segments the text and pre-measures character widths using the browser's font engine. ~19ms for 500 texts.
2. **Layout** (per render): Pure arithmetic over the cached widths. ~0.09ms per call — safe to run every render.

`usePreparedText` / `usePreparedTextWithSegments` memoize Phase 1 so it only reruns when `text` or `font` changes. `usePretextLayout` / `usePretextLines` run Phase 2 on every render but this is negligible.

## License

MIT
