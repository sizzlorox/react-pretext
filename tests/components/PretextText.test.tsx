import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { PretextText } from '../../src/components/PretextText'

describe('PretextText', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <PretextText text="Hello" font="16px sans-serif" lineHeight={24} />
    )
    expect(container.firstChild).not.toBeNull()
  })

  it('renders a div wrapper', () => {
    const { container } = render(
      <PretextText text="Hello" font="16px sans-serif" lineHeight={24} />
    )
    expect(container.querySelector('div')).not.toBeNull()
  })

  it('forwards className and style to the container', () => {
    const { container } = render(
      <PretextText
        text="Hello"
        font="16px sans-serif"
        lineHeight={24}
        className="my-class"
        style={{ width: '300px' }}
      />
    )
    const div = container.querySelector('div')!
    expect(div.className).toBe('my-class')
    expect(div.style.width).toBe('300px')
  })

  it('applies lineClassName to line spans after layout', () => {
    const { container } = render(
      <PretextText
        text="Hello world"
        font="16px sans-serif"
        lineHeight={24}
        lineClassName="line"
        style={{ width: '300px' }}
      />
    )
    // After ResizeObserver mock fires with width=300, lines should be rendered
    const lines = container.querySelectorAll('span.line')
    expect(lines.length).toBeGreaterThan(0)
  })
})
