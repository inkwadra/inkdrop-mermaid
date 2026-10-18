import React from 'react'

import { useMermaidRendering, type UseMermaidRenderingOptions } from './render'
import { MermaidToolbar, type MermaidButtonProps } from './toolbar'
import { useZoomControls } from './zoom-controls'

export type { MermaidButtonProps }

export interface MermaidDiagramProps extends Omit<
  UseMermaidRenderingOptions,
  'printMode' | 'panZoom' | 'fill'
> {
  /** The diagram source (the body of a ```mermaid fenced block). */
  code: string
  /**
   * The host's button component, used for the toolbar controls. Inkdrop:
   * `components.getComponentClass('Button')`; web: `@inkdropapp/uikit`'s
   * `UIButton`. Without one the toolbar renders nothing.
   */
  Button?: React.ComponentType<MermaidButtonProps>
  /**
   * Whether the diagram is being rendered for print/export. Read from the
   * host's own `MarkdownRendererContext` — this package never imports it, so
   * that a bundled second copy of the context can't silently report `false`.
   */
  printMode?: boolean
  /** Show the hover toolbar. Ignored in print mode. */
  toolbar?: boolean
  /**
   * Enable zooming (Ctrl/Cmd + scroll, pinch, double-click, the toolbar) and
   * dragging a zoomed diagram. Ignored in print mode.
   */
  panZoom?: boolean
  /**
   * Fit the diagram to its container in both axes instead of its width alone,
   * and keep the toolbar visible rather than hover-gated. For full-screen /
   * lightbox shells.
   */
  fill?: boolean
  /** When set, the toolbar shows an expand button that calls this. */
  onExpand?: () => void
}

/**
 * A Mermaid diagram rendered by Pele, with optional pan/zoom and a hover toolbar.
 *
 * Host-agnostic by construction: every host-specific value (the button
 * component, print mode, the theme signal) arrives as a prop, so the same
 * component serves the Inkdrop plugin, the website demo, and the mobile web
 * editor. See {@link MermaidDiagramProps}.
 *
 * Colours come from the `--mermaid-*` custom properties in
 * `@inkdropapp/css/mermaid.css`, which `styles/mermaid.css` maps onto Pele's
 * `--pele-*` variables. Without that sheet the diagram falls back to Pele's
 * default palette.
 */
export const MermaidDiagram: React.FC<MermaidDiagramProps> = ({
  code,
  Button,
  printMode = false,
  toolbar = true,
  panZoom = true,
  fill = false,
  onExpand,
  themeRevision,
  themeSwapDelayMs
}) => {
  const { error, containerRef, getZoom } = useMermaidRendering(code, {
    printMode,
    panZoom,
    fill,
    themeRevision,
    themeSwapDelayMs
  })
  const controls = useZoomControls(getZoom)

  const className = [
    'mermaid-diagram',
    fill && 'mermaid-diagram-fill',
    printMode && 'mermaid-diagram-print'
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={className}>
      <div className="mermaid-diagram-content">
        <div className={printMode ? '' : 'mermaid-dot-grid'} ref={containerRef} />
      </div>
      {toolbar && !printMode && (
        <MermaidToolbar
          error={error}
          panZoom={panZoom}
          controls={controls}
          Button={Button}
          onExpand={onExpand}
        />
      )}
    </div>
  )
}

MermaidDiagram.displayName = 'MermaidDiagram'
