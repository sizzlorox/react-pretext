// Hooks — granular API for full control
export { usePreparedText } from "./hooks/usePreparedText";
export { usePreparedTextWithSegments } from "./hooks/usePreparedTextWithSegments";
export { usePretextLayout } from "./hooks/usePretextLayout";
export { usePretextLines } from "./hooks/usePretextLines";
export { usePretext } from "./hooks/usePretext";
export type { UsePretextOptions } from "./hooks/usePretext";
export { usePretextContainerWidth } from "./hooks/usePretextContainerWidth";

// Components
export { PretextText } from "./components/PretextText";
export type { PretextTextProps } from "./components/PretextText";

// Re-exported pretext types — consumers don't need to import @chenglou/pretext directly
export type {
  PreparedText,
  PreparedTextWithSegments,
  PrepareOptions,
  LayoutResult,
  LayoutLine,
  LayoutLineRange,
  LayoutLinesResult,
  LayoutCursor,
} from "@chenglou/pretext";

// Re-exported pretext utilities — global helpers
export { clearCache, setLocale } from "@chenglou/pretext";
// Re-exported low-level layout primitives — useful for advanced use cases
// like flowing text around shapes where maxWidth varies per line
export { layoutNextLine, walkLineRanges } from "@chenglou/pretext";
