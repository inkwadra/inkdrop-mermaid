import { mount, type Mounted, type MountOptions, type Zoom, type ZoomOptions } from 'pele'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

/** Default wait for a newly-selected theme's stylesheet to swap in. */
export const DEFAULT_THEME_SWAP_DELAY_MS = 400

/**
 * Pele's zoom, with its own buttons turned off — the toolbar drives it through
 * the host's Button instead. `always` lets a diagram that already fits be
 * enlarged too, not just one Pele shrank to fit. Kept as one object so that
 * `Mounted.update()` sees the same option and does not rebuild the zoom.
 */
const ZOOM_OPTIONS: ZoomOptions = { always: true, controls: false }

const toError = (err: unknown): Error =>
  err instanceof Error ? err : new Error('Unknown error', { cause: err })

/**
 * Size the SVG to the largest box that fits the container in both axes, for
 * the `fill` variant. Pele only fits a diagram to its container's width, so a
 * tall diagram would otherwise run off the bottom of a full-screen shell.
 */
const fitToContainer = (container: HTMLElement) => {
  const svg = container.querySelector<SVGSVGElement>(':scope > svg')
  if (!svg) return
  const width = Number(svg.getAttribute('width'))
  const height = Number(svg.getAttribute('height'))
  const { clientWidth, clientHeight } = container
  if (!width || !height || !clientWidth || !clientHeight) return
  svg.style.width = `${Math.min(clientWidth, (clientHeight * width) / height)}px`
}

export interface UseMermaidRenderingOptions {
  /**
   * Whether the diagram is being rendered for print/export: colours are pinned
   * to their light variants and pan/zoom is off.
   */
  printMode?: boolean
  /** Enable drag-to-pan and Ctrl/Cmd + scroll zoom. Ignored in print mode. */
  panZoom?: boolean
  /** Size the diagram to fit its container in both axes. */
  fill?: boolean
  /**
   * Changes whenever the host's theme changes. Colours follow the theme on
   * their own (they are CSS variables), but the theme may also change the font
   * labels were measured in — a new value here re-measures them.
   */
  themeRevision?: string | number
  /**
   * How long to wait after `themeRevision` changes before re-measuring, so the
   * newly-selected theme's stylesheet has swapped in. Set `0` for hosts that
   * swap synchronously.
   */
  themeSwapDelayMs?: number
}

/**
 * Render `code` into a container with Pele, re-rendering when the code or the
 * options change and re-fitting when the container is resized.
 *
 * @returns The render error (if any), the container ref to attach, and a
 *   getter for the live Pele zoom (absent while pan/zoom is off).
 */
export const useMermaidRendering = (
  code: string,
  {
    printMode = false,
    panZoom = true,
    fill = false,
    themeRevision,
    themeSwapDelayMs = DEFAULT_THEME_SWAP_DELAY_MS
  }: UseMermaidRenderingOptions = {}
) => {
  const [error, setError] = useState<Error | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mountedRef = useRef<Mounted | null>(null)
  const renderedRevisionRef = useRef(themeRevision)

  const options = useMemo<MountOptions>(
    () => ({
      zoom: panZoom && !printMode ? ZOOM_OPTIONS : false,
      onRender: () => {
        const container = containerRef.current
        if (fill && container) {
          fitToContainer(container)
          // The zoom captured the SVG's size before onRender ran; on the first
          // render it is created afterwards, so there is nothing to refresh.
          mountedRef.current?.zoom?.refresh()
        }
        setError(null)
      },
      onError: err => setError(toError(err))
    }),
    [panZoom, printMode, fill]
  )

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    if (!code) {
      mountedRef.current?.destroy()
      mountedRef.current = null
      container.replaceChildren()
      return
    }
    // Pele reports bad diagrams through onError and shows them in the
    // container; anything thrown here is a bug, not a diagram error.
    if (mountedRef.current) mountedRef.current.update(code, options)
    else mountedRef.current = mount(container, code, options)
  }, [code, options])

  useEffect(
    () => () => {
      mountedRef.current?.destroy()
      mountedRef.current = null
    },
    []
  )

  // Pele already redraws for width changes; `fill` also has to follow height.
  useEffect(() => {
    const container = containerRef.current
    if (!fill || !container) return
    const observer = new ResizeObserver(() => {
      fitToContainer(container)
      mountedRef.current?.zoom?.refresh()
    })
    observer.observe(container)
    return () => observer.disconnect()
  }, [fill])

  useEffect(() => {
    if (renderedRevisionRef.current === themeRevision) return
    const timer = setTimeout(() => {
      renderedRevisionRef.current = themeRevision
      mountedRef.current?.refresh()
    }, themeSwapDelayMs)
    return () => clearTimeout(timer)
  }, [themeRevision, themeSwapDelayMs])

  const getZoom = useCallback((): Zoom | undefined => mountedRef.current?.zoom, [])

  // Clearing the code leaves the last error in state; it no longer applies.
  return { error: code ? error : null, containerRef, getZoom }
}
