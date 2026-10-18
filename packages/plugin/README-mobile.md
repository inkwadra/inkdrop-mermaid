It allows you to draw flowcharts and diagrams using [Mermaid](https://mermaid.js.org/) syntax in Markdown code blocks, rendered by [Pele](https://pele.run).

## Usage

    ```mermaid
    graph LR
        A --- B
        B-->C[fa:fa-ban forbidden]
        B-->D(fa:fa-spinner);
    ```

It will be rendered as:

![](https://github.com/inkdropapp/inkdrop-mermaid/raw/master/docs/images/example-01.png)

    ```mermaid
    sequenceDiagram
        participant Alice
        participant Bob
        Alice->John: Hello John, how are you?
        loop Healthcheck
            John->John: Fight against hypochondria
        end
        Note right of John: Rational thoughts <br/>prevail...
        John-->Alice: Great!
        John->Bob: How about you?
        Bob-->John: Jolly good!
    ```

It will be rendered as:

![](https://github.com/inkdropapp/inkdrop-mermaid/raw/master/docs/images/example-02.png)
