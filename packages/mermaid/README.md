# @inkdropapp/mermaid

React components for rendering [Mermaid](https://mermaid.js.org/) diagrams with
[Pele](https://pele.run) that follow the host's theme, with zoom / pan and a hover toolbar.

Extracted from the [Inkdrop Mermaid plugin](https://github.com/inkdropapp/inkdrop-mermaid)
so the plugin, the website demo, and the mobile web editor can share one implementation
instead of each carrying a port of it.

The guiding principle: **this package is host-agnostic.** It imports no Inkdrop API.
Everything host-specific — the button component, print mode, the theme signal — arrives
as a prop, so the same component works inside the desktop app, a Next.js page, or a
mobile WebView.

## Install

```shell
npm install @inkdropapp/mermaid
```

`react` is a **peer dependency**. [`pele`](https://www.npmjs.com/package/pele) is a regular
dependency; it has no runtime dependencies of its own.

## Required stylesheets

Two sheets, and **both are load-bearing**:

```ts
import '@inkdropapp/css/mermaid.css' // the --mermaid-* design tokens
import '@inkdropapp/mermaid/styles.css' // component layout (diagram, toolbar)
```

`@inkdropapp/css/mermaid.css` defines the `--mermaid-*` custom properties, and this
package's sheet maps them onto Pele's `--pele-*` variables (`--pele-surface` ←
`--mermaid-node-background-color`, `--pele-line` ← `--mermaid-line-color`, and so on).
Without the token sheet, diagrams fall back to Pele's default palette.

`--pele-bg` is mapped to `--editor-background-color`, not `--mermaid-background-color`:
Pele paints it behind edge labels and as text on filled shapes, so it has to be opaque.
Override it on `.mermaid-diagram` when a diagram sits on another background.

## Usage

```tsx
import { MermaidDiagram } from '@inkdropapp/mermaid'

export function Diagram() {
  return <MermaidDiagram code="graph TD; A-->B;" />
}
```

With a host button component and a theme signal:

```tsx
import { MarkdownRendererContext } from '@inkdropapp/markdown'
import { MermaidDiagram } from '@inkdropapp/mermaid'
import { UIButton } from '@inkdropapp/uikit'

function Diagram({ code }: { code: string }) {
  const { printMode } = useContext(MarkdownRendererContext)
  const theme = useTheme() // whatever the host uses

  return (
    <MermaidDiagram code={code} Button={UIButton} printMode={printMode} themeRevision={theme} />
  )
}
```

### Props

| Prop               | Default | Description                                                                                                    |
| ------------------ | ------- | -------------------------------------------------------------------------------------------------------------- |
| `code`             | —       | The diagram source (the body of a ` ```mermaid ` block).                                                       |
| `Button`           | —       | The host's button component, used for the toolbar. Without one the toolbar renders nothing.                    |
| `printMode`        | `false` | Render for print/export: pins colours to their light variants and hides the toolbar and zoom.                  |
| `toolbar`          | `true`  | Show the hover toolbar. Ignored in print mode.                                                                 |
| `panZoom`          | `true`  | Enable Pele's zoom (Ctrl/Cmd + scroll, pinch, double-click, toolbar) and dragging. Ignored in print mode.      |
| `fill`             | `false` | Fit the diagram to its container in both axes and keep the toolbar visible, for full-screen / lightbox shells. |
| `themeRevision`    | —       | Any value that changes when the host's theme changes; re-measures labels if the theme changed the font.        |
| `themeSwapDelayMs` | `400`   | Wait before re-measuring, so the new theme's stylesheet has swapped in. Set `0` for synchronous theme swaps.   |
| `onExpand`         | —       | When set, the toolbar shows an expand button that calls this.                                                  |

### Theme switches

Pele's SVG references `--pele-*` variables rather than concrete colours, so a drawn diagram
follows a theme switch — light/dark included — without re-rendering. `themeRevision` is
only needed because Pele measures labels in the current font when it lays a diagram out: a
theme that changes the font needs a re-measure, which a new `themeRevision` triggers once
`themeSwapDelayMs` has passed.

### Errors

A diagram that cannot be parsed is reported in place by Pele: the last good drawing stays,
dimmed, with the error over its bottom edge, or the message alone if nothing has been drawn
yet. The error is coloured with `--pele-error` (← `--mermaid-error-text-color`). The
toolbar is hidden while there is an error.

### Full-screen

The package renders the diagram; the host supplies the shell (backdrop, padding, close
button). Pass `fill` so the diagram sizes to that shell:

```tsx
<div className="my-lightbox">
  <MermaidDiagram code={code} Button={UIButton} fill />
  <CloseButton />
</div>
```

## Also exported

`useMermaidRendering`, `useZoomControls`, `MermaidToolbar`, and the toolbar icons — for
hosts that want to compose their own layout instead of using `MermaidDiagram`.

## Migrating from 0.2 (Mermaid)

- `mermaid` and `panzoom` are no longer peer dependencies; uninstall them if nothing else
  uses them.
- `buildInkdropThemeVariables` and `usePanZoom` are gone. Theming is plain CSS now; zoom
  comes from Pele, driven through `useZoomControls`.
- `useMermaidRendering(code, options)` takes the code and an options object (`printMode`,
  `panZoom`, `fill`, `themeRevision`, `themeSwapDelayMs`) and returns `getZoom` instead of
  `renderNonce`.
- Mermaid's `themeVariables` (including in `%%{init}%%` directives) no longer apply. Use
  `style` / `classDef` in the diagram, or the `--pele-*` variables.
- Pele has its own layout and visual style, so diagrams look different from Mermaid's.

## License

MIT
