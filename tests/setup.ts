// jsdom doesn't implement canvas or ResizeObserver — mock both.

// Canvas: pretext uses measureText internally for character width measurement.
HTMLCanvasElement.prototype.getContext = function () {
  return {
    measureText: (text: string) => ({ width: text.length * 8 }),
    font: '',
  } as unknown as CanvasRenderingContext2D
}

// ResizeObserver: used by usePretextContainerWidth
class ResizeObserverMock {
  private callback: ResizeObserverCallback

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback
  }

  observe(target: Element) {
    // Immediately fire with a fixed width so tests that depend on width get a value
    this.callback(
      [
        {
          target,
          contentRect: { width: 300, height: 0 } as DOMRectReadOnly,
          contentBoxSize: [{ inlineSize: 300, blockSize: 0 }],
          borderBoxSize: [{ inlineSize: 300, blockSize: 0 }],
          devicePixelContentBoxSize: [{ inlineSize: 300, blockSize: 0 }],
        },
      ],
      this as unknown as ResizeObserver
    )
  }

  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver
