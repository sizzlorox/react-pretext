/**
 * Demonstrates text flowing around moving shapes in real time.
 *
 * Uses react-pretext hooks:
 *   - usePretextContainerWidth  → tracks the container's pixel width
 *   - usePreparedTextWithSegments → memoizes the expensive prepare() call
 *   - layoutNextLine (re-exported) → lays out one line at a time with a
 *     custom maxWidth, letting us flow text around arbitrary obstacles
 *
 * Orbs are pure CSS divs (radial-gradient + box-shadow). Text lines are
 * React elements. Zero canvas, zero DOM reads during layout.
 */
import { useRef, useState, useEffect } from "react";
import {
  usePreparedTextWithSegments,
  usePretextContainerWidth,
  layoutNextLine,
} from "react-pretext";
import type { PreparedTextWithSegments, LayoutCursor } from "react-pretext";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const FONT = "15px Georgia, serif";
const LINE_HEIGHT = 22;
const HEIGHT = 400;
const PAD = 14; // horizontal page margin
const MIN_SLOT = 55; // narrowest slot worth filling
const CIRCLE_PAD_H = 10; // extra breathing room around each orb
const CIRCLE_PAD_V = 3;

const TEXT =
  "Pretext computes text layout using pure arithmetic over pre-measured " +
  "character widths — no DOM reads, no layout reflow, no getBoundingClientRect. " +
  "It measures a font once, caches the widths, then answers every subsequent " +
  "layout query in microseconds. The hooks in react-pretext memoize the " +
  "expensive preparation step so it only runs when the text or font changes. " +
  "Everything you see here — each line break, each offset from an orb — is " +
  "decided by usePreparedTextWithSegments and layoutNextLine, updated sixty " +
  "times per second without a single synchronous layout operation. " +
  "Drag the orbs to reshape the flow. Click the background to pause. " +
  "Resize the window and watch the columns reflow instantly.";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type Orb = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  hue: number;
};
type Line = { text: string; x: number; y: number };

// ---------------------------------------------------------------------------
// Orb physics
// ---------------------------------------------------------------------------
function makeOrbs(w: number): Orb[] {
  return [
    { id: 0, x: w * 0.18, y: HEIGHT * 0.5, vx: 1.4, vy: 0.9, r: 85, hue: 255 },
    {
      id: 1,
      x: w * 0.78,
      y: HEIGHT * 0.28,
      vx: -1.2,
      vy: 1.5,
      r: 72,
      hue: 185,
    },
    { id: 2, x: w * 0.5, y: HEIGHT * 0.74, vx: 0.8, vy: -1.4, r: 63, hue: 325 },
  ];
}

function stepOrb(o: Orb, w: number): Orb {
  let { x, y, vx, vy } = o;
  x += vx;
  y += vy;
  if (x - o.r < 0) {
    x = o.r;
    vx = Math.abs(vx);
  }
  if (x + o.r > w) {
    x = w - o.r;
    vx = -Math.abs(vx);
  }
  if (y - o.r < 0) {
    y = o.r;
    vy = Math.abs(vy);
  }
  if (y + o.r > HEIGHT) {
    y = HEIGHT - o.r;
    vy = -Math.abs(vy);
  }
  return { ...o, x, y, vx, vy };
}

// ---------------------------------------------------------------------------
// Geometry helpers (same algorithm as the original pretext editorial demo)
// ---------------------------------------------------------------------------

/**
 * Returns the horizontal interval [left, right] that a circle blocks for a
 * line band, including padding. Returns null if the circle doesn't overlap.
 */
function circleIntervalForBand(
  cx: number,
  cy: number,
  r: number,
  bandTop: number,
  bandBottom: number,
): { left: number; right: number } | null {
  const top = bandTop - CIRCLE_PAD_V;
  const bottom = bandBottom + CIRCLE_PAD_V;
  if (top >= cy + r || bottom <= cy - r) return null;
  const minDy =
    cy >= top && cy <= bottom ? 0 : cy < top ? top - cy : cy - bottom;
  if (minDy >= r) return null;
  const dx = Math.sqrt(r * r - minDy * minDy);
  return { left: cx - dx - CIRCLE_PAD_H, right: cx + dx + CIRCLE_PAD_H };
}

/**
 * Subtracts blocked intervals from a base slot, returning all remaining
 * sub-slots wide enough for text. Handles multiple overlapping obstacles.
 */
function carveSlots(
  base: { left: number; right: number },
  blocked: Array<{ left: number; right: number }>,
): Array<{ left: number; right: number }> {
  let slots = [base];
  for (const iv of blocked) {
    const next: typeof slots = [];
    for (const s of slots) {
      if (iv.right <= s.left || iv.left >= s.right) {
        next.push(s);
        continue;
      }
      if (iv.left > s.left) next.push({ left: s.left, right: iv.left });
      if (iv.right < s.right) next.push({ left: iv.right, right: s.right });
    }
    slots = next;
  }
  return slots.filter((s) => s.right - s.left >= MIN_SLOT);
}

// ---------------------------------------------------------------------------
// Text layout — the core of the demo
// Uses usePreparedTextWithSegments (hook) + layoutNextLine (re-export)
// ---------------------------------------------------------------------------
function buildLines(
  prepared: PreparedTextWithSegments,
  orbs: Orb[],
  containerWidth: number,
): Line[] {
  const lines: Line[] = [];
  let cursor: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 };

  for (let y = PAD; y + LINE_HEIGHT <= HEIGHT - PAD; y += LINE_HEIGHT) {
    // 1. Find which horizontal ranges each orb blocks for this line band
    const blocked = orbs
      .map((o) => circleIntervalForBand(o.x, o.y, o.r, y, y + LINE_HEIGHT))
      .filter((iv): iv is NonNullable<typeof iv> => iv !== null);

    // 2. Carve available text slots out of the full width
    const slots = carveSlots(
      { left: PAD, right: containerWidth - PAD },
      blocked,
    );

    // 3. Fill each slot left-to-right using layoutNextLine
    for (const slot of slots) {
      const line = layoutNextLine(prepared, cursor, slot.right - slot.left);
      if (!line) return lines; // text exhausted
      lines.push({ text: line.text, x: slot.left, y });
      cursor = line.end;
    }
  }

  return lines;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function BallsDemo() {
  // ── react-pretext hooks ─────────────────────────────────────────────────
  const containerRef = useRef<HTMLDivElement>(null);
  const width = usePretextContainerWidth(containerRef); // ResizeObserver → px
  const prepared = usePreparedTextWithSegments(TEXT, FONT); // memoized prepare()
  // ────────────────────────────────────────────────────────────────────────

  const [paused, setPaused] = useState(false);
  const [orbs, setOrbs] = useState<Orb[]>([]);
  const draggingId = useRef<number | null>(null);

  // Init orbs once width is known
  useEffect(() => {
    if (width && orbs.length === 0) setOrbs(makeOrbs(width));
  }, [width, orbs.length]);

  // Animation loop — skip the orb currently being dragged
  useEffect(() => {
    if (paused || !width) return;
    let rafId: number;
    const tick = () => {
      setOrbs((prev) =>
        prev.map((o) => (o.id === draggingId.current ? o : stepOrb(o, width))),
      );
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [paused, width]);

  // Pointer drag handlers
  const onOrbPointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
    id: number,
  ) => {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    draggingId.current = id;
    setPaused(true);
  };

  const onOrbPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (draggingId.current === null || !containerRef.current || !width) return;
    const rect = containerRef.current.getBoundingClientRect();
    setOrbs((prev) =>
      prev.map((o) =>
        o.id === draggingId.current
          ? {
              ...o,
              x: Math.max(o.r, Math.min(width - o.r, e.clientX - rect.left)),
              y: Math.max(o.r, Math.min(HEIGHT - o.r, e.clientY - rect.top)),
            }
          : o,
      ),
    );
  };

  const onOrbPointerUp = () => {
    draggingId.current = null;
  };

  // Container click = toggle pause (only when not ending a drag)
  const onContainerClick = () => {
    if (draggingId.current !== null) return;
    setPaused((p) => !p);
  };

  // ── Text layout — recomputed whenever orbs or width change ──────────────
  // This is where usePreparedTextWithSegments + layoutNextLine do their work.
  // No useMemo: orbs change every animation frame, so memoization has no benefit.
  const lines =
    prepared && width && orbs.length > 0
      ? buildLines(prepared, orbs, width)
      : [];
  // ────────────────────────────────────────────────────────────────────────

  return (
    <div
      ref={containerRef}
      onClick={onContainerClick}
      style={{
        position: "relative",
        height: HEIGHT,
        background: "#0d0d1a",
        borderRadius: 8,
        overflow: "hidden",
        cursor: "pointer",
        marginTop: "1rem",
        userSelect: "none",
      }}
    >
      {/* ── Orbs ─────────────────────────────────── */}
      {orbs.map((orb) => (
        <div
          key={orb.id}
          onPointerDown={(e) => onOrbPointerDown(e, orb.id)}
          onPointerMove={onOrbPointerMove}
          onPointerUp={onOrbPointerUp}
          style={{
            position: "absolute",
            left: orb.x - orb.r,
            top: orb.y - orb.r,
            width: orb.r * 2,
            height: orb.r * 2,
            borderRadius: "50%",
            background: `radial-gradient(circle at 35% 35%,
              hsl(${orb.hue},70%,72%) 0%,
              hsl(${orb.hue},60%,40%) 55%,
              transparent 72%)`,
            boxShadow: [
              `0 0 ${orb.r * 0.5}px hsla(${orb.hue},70%,60%,0.5)`,
              `0 0 ${orb.r * 1.2}px hsla(${orb.hue},65%,50%,0.2)`,
            ].join(","),
            cursor: "grab",
          }}
        />
      ))}

      {/* ── Text lines: placed by react-pretext, rendered by React ──────── */}
      {lines.map((line, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            top: line.y,
            left: line.x,
            height: LINE_HEIGHT,
            lineHeight: `${LINE_HEIGHT}px`,
            font: FONT,
            color: "rgba(255,255,255,0.88)",
            whiteSpace: "nowrap",
            pointerEvents: "none",
          }}
        >
          {line.text}
        </span>
      ))}

      {/* ── HUD ─────────────────────────────────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          bottom: 8,
          right: 12,
          fontSize: 11,
          color: "rgba(255,255,255,0.3)",
          pointerEvents: "none",
        }}
      >
        {paused
          ? "click to resume"
          : "drag orbs · click to pause · zero DOM reads"}
      </div>
    </div>
  );
}
