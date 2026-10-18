import type { Zoom } from 'pele'
import { useMemo } from 'react'

const ZOOM_STEP = 1.4

export interface PanZoomControls {
  zoomIn: () => void
  zoomOut: () => void
  reset: () => void
}

/**
 * Toolbar controls for a diagram's Pele zoom.
 *
 * @param getZoom - Returns the live zoom, from `useMermaidRendering`. Read on
 *   every click rather than captured, because Pele replaces the zoom whenever
 *   the `zoom` option changes. The controls do nothing while it is absent.
 */
export const useZoomControls = (getZoom: () => Zoom | undefined): PanZoomControls =>
  useMemo(
    () => ({
      zoomIn: () => getZoom()?.zoomBy(ZOOM_STEP),
      zoomOut: () => getZoom()?.zoomBy(1 / ZOOM_STEP),
      reset: () => getZoom()?.reset()
    }),
    [getZoom]
  )
