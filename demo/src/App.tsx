import { useRef, useState } from 'react'
import { usePretext, usePretextContainerWidth, PretextText } from 'react-pretext'
import { BallsDemo } from './BallsDemo'

const DEFAULT_TEXT =
  'The quick brown fox jumps over the lazy dog. ' +
  'Pack my box with five dozen liquor jugs. ' +
  'How vexingly quick daft zebras jump!'

const FONT = '16px system-ui, sans-serif'
const LINE_HEIGHT = 24

// ---------------------------------------------------------------------------
// Section 1: <PretextText> drop-in component
// ---------------------------------------------------------------------------
function ComponentDemo() {
  const [text, setText] = useState(DEFAULT_TEXT)
  const [maxWidth, setMaxWidth] = useState(400)

  return (
    <div className="card">
      <label htmlFor="text1">Text</label>
      <textarea
        id="text1"
        rows={3}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="controls">
        <label htmlFor="width1">
          Width: <strong>{maxWidth}px</strong>
        </label>
        <input
          id="width1"
          type="range"
          min={80}
          max={700}
          value={maxWidth}
          onChange={(e) => setMaxWidth(Number(e.target.value))}
        />
      </div>

      {/* The font prop on PretextText must match the element's computed CSS font.
          Setting style={{ font: FONT }} on the container ensures they match. */}
      <div className="pretext-box" style={{ width: maxWidth }}>
        <PretextText
          text={text}
          font={FONT}
          lineHeight={LINE_HEIGHT}
          lineClassName="line-span"
          style={{ font: FONT }}
        />
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Section 2: usePretext hook — per-line stats
// ---------------------------------------------------------------------------
function HookDemo() {
  const [text, setText] = useState(DEFAULT_TEXT)
  const [maxWidth, setMaxWidth] = useState(400)

  const result = usePretext(text, {
    font: FONT,
    maxWidth,
    lineHeight: LINE_HEIGHT,
    withLines: true,
  })

  return (
    <div className="card">
      <label htmlFor="text2">Text</label>
      <textarea
        id="text2"
        rows={3}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="controls">
        <label htmlFor="width2">
          Max width: <strong>{maxWidth}px</strong>
        </label>
        <input
          id="width2"
          type="range"
          min={80}
          max={700}
          value={maxWidth}
          onChange={(e) => setMaxWidth(Number(e.target.value))}
        />
      </div>

      <div aria-live="polite">
        {result !== null ? (
          <>
            <p className="stat">
              <strong>{result.lineCount}</strong> lines ·{' '}
              <strong>{result.height}px</strong> total height
            </p>
            <ol className="line-list">
              {result.lines.map((line) => (
                <li key={line.start.segmentIndex}>
                  &ldquo;{line.text}&rdquo;{' '}
                  <span className="line-width">({Math.round(line.width)}px)</span>
                </li>
              ))}
            </ol>
          </>
        ) : (
          <p className="stat">Type something above.</p>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Section 3: usePretextContainerWidth — responsive container
// ---------------------------------------------------------------------------
function ContainerWidthDemo() {
  const ref = useRef<HTMLDivElement>(null)
  const width = usePretextContainerWidth(ref)

  const result = usePretext(DEFAULT_TEXT, {
    font: FONT,
    maxWidth: width ?? 0,
    lineHeight: LINE_HEIGHT,
  })

  return (
    <div className="card" ref={ref}>
      <p className="stat" aria-live="polite">
        Container width:{' '}
        <strong>{width !== null ? `${Math.round(width)}px` : '…'}</strong>
        {result !== null && (
          <>
            {' '}· <strong>{result.lineCount}</strong> lines ·{' '}
            <strong>{result.height}px</strong> tall
          </>
        )}
      </p>
      <p style={{ margin: '0.5rem 0 0', font: FONT, lineHeight: `${LINE_HEIGHT}px` }}>
        {DEFAULT_TEXT}
      </p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------
export function App() {
  return (
    <>
      <h1>react-pretext</h1>
      <p>
        React hooks and components for{' '}
        <a href="https://github.com/chenglou/pretext">@chenglou/pretext</a> — high-performance
        text measurement without DOM reflows.
      </p>

      <h2>1. &lt;PretextText&gt; component</h2>
      <p>Drop-in component. Adjust the slider to see pretext reflow text without touching the DOM.</p>
      <ComponentDemo />

      <h2>2. usePretext hook</h2>
      <p>
        Returns <code>lineCount</code>, <code>height</code>, and optional per-line text data.
      </p>
      <HookDemo />

      <h2>3. usePretextContainerWidth</h2>
      <p>
        Tracks container width via <code>ResizeObserver</code>. Resize the window to see it update.
      </p>
      <ContainerWidthDemo />

      <h2>4. Text flowing around shapes</h2>
      <p>
        <code>layoutNextLine</code> computes one line at a time with a custom width — here used
        to flow text around moving balls at 60fps with zero DOM reflows.
      </p>
      <BallsDemo />

      <footer>
        <a href="https://github.com/sizzlorox/react-pretext">GitHub</a>
        {' · '}
        <a href="https://www.npmjs.com/package/react-pretext">npm</a>
      </footer>
    </>
  )
}
