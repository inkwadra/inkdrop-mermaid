# Mermaid plugin for Inkdrop

A plugin for drawing flowcharts and diagrams using [Mermaid](https://mermaid.js.org/) syntax in Markdown code blocks, rendered by [Pele](https://pele.run).

## Install

Check out [the docs](https://docs.inkdrop.app/manual/extend-inkdrop-with-plugins) on how to install plugins.

### Command-line

```shell
ipm install mermaid
```

## Usage

    ```mermaid
    graph TD;
        A-->B;
        A-->C;
        B-->D;
        C-->D;
    ```

It will be rendered as:

![Flowchart example](https://github.com/inkdropapp/inkdrop-mermaid/raw/master/docs/images/example-01.png)

    ```mermaid
    sequenceDiagram
        participant Alice
        participant Bob
        Alice->>John: Hello John, how are you?
        loop Healthcheck
            John->>John: Fight against hypochondria
        end
        Note right of John: Rational thoughts <br/>prevail...
        John-->>Alice: Great!
        John->>Bob: How about you?
        Bob-->>John: Jolly gooda!
    ```

It will be rendered as:

![Sequence diagram example](https://github.com/inkdropapp/inkdrop-mermaid/raw/master/docs/images/example-02.png)

## Interacting with diagrams

Rendered diagrams are interactive:

- **Ctrl/Cmd + scroll** or **pinch** to zoom in and out (a plain scroll still scrolls the
  note).
- **Double-click** to zoom in, and again to reset.
- **Drag** to pan a zoomed diagram. At its normal size, dragging selects text.
- With the diagram focused, **+** / **-** zoom, **0** resets, and the **arrow keys** pan.

Hover a diagram to reveal a floating toolbar in the bottom-right corner with zoom
in / out / reset controls and a button to open the diagram **full-screen**.

While you edit, a diagram with a syntax error keeps its last good drawing, dimmed, with
the error shown under it.

Both pan & zoom and the toolbar are enabled by default and can be toggled in
[Preferences](#preferences).

## Theming

Diagrams automatically match your active Inkdrop theme. Their colors come from the
theme's `--mermaid-*` CSS variables, including the per-diagram ones such as sequence
notes, Gantt task states or the pie and git palettes. They apply live, so switching between
light and dark — or any custom theme — restyles every diagram instantly. No configuration
required.

Exports and prints render in light mode, so diagrams stay legible on white paper.

### Per-diagram overrides

Mermaid's `themeVariables` (for example in a `%%{init}%%` directive) are not applied.
Style individual nodes and edges with `style`, `classDef` and `linkStyle` instead:

    ```mermaid
    flowchart LR
      A[Draft] --> B[Review]:::warn --> C[Done]
      style C fill:#879a39,stroke:#66800b,color:#fffcf0
      classDef warn fill:#d0a215,stroke:#ad8301
      linkStyle 0 stroke:#878580,stroke-dasharray:4 4
    ```

Colors set this way are fixed and do not change with the theme. See
[Pele's theming docs](https://pele.run/theming) for more.

## Preferences

Configure the plugin in Preferences → Plugins → mermaid:

| Option         | Default | Description                                                       |
| -------------- | ------- | ----------------------------------------------------------------- |
| **Pan & Zoom** | On      | Ctrl/Cmd + scroll or pinch to zoom diagrams, and drag to pan.     |
| **Toolbar**    | On      | Show a hover toolbar with zoom controls and a full-screen button. |

## Changelog

See the [Releases](https://github.com/inkdropapp/inkdrop-mermaid/releases) page for the changelog.
