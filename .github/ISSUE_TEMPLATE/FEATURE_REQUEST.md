---
name: Feature request
about: Propose a new hook, API, or behavior change
labels: enhancement
---

## What problem does this solve?

<!-- Describe the use case or limitation you are running into.
     e.g. "I'm building a virtualized list and need per-line heights before the container mounts." -->

## Which part of the API is affected?

<!-- Check all that apply -->
- [ ] `usePretext` (combined hook)
- [ ] `usePreparedText` / `usePreparedTextWithSegments` (Phase 1)
- [ ] `usePretextLayout` / `usePretextLines` (Phase 2)
- [ ] `usePretextContainerWidth`
- [ ] `<PretextText>` component
- [ ] Low-level primitives (`layoutNextLine`, `walkLineRanges`)
- [ ] New hook / API surface

## Does this require a change in `@chenglou/pretext` itself?

<!-- If the feature needs new primitives from the upstream library, link the relevant pretext issue or explain what would be needed. -->

## Proposed API

<!-- Sketch the hook signature, new props, or return type changes. -->

```ts
// example
```

## Workaround today

<!-- How are you currently working around this limitation, if at all? -->
