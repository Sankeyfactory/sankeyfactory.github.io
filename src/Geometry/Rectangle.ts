import { PanZoom } from "panzoom";

export class Rectangle
{
    public constructor(
        public x: number,
        public y: number,
        public width: number,
        public height: number,
    ) { }

    public static fromSvgRect(element: SVGElement): Rectangle
    {
        return new Rectangle(
            +element.getAttribute("x")!,
            +element.getAttribute("y")!,
            +element.getAttribute("width")!,
            +element.getAttribute("height")!,
        );
    }

    public static fromSvgBounds(element: SVGElement, panContext: PanZoom): Rectangle
    {
        let zoomScale = panContext.getTransform().scale;

        let bounds: Rectangle = element.getBoundingClientRect();

        bounds = {
            x: (bounds.x - panContext.getTransform().x) / zoomScale,
            y: (bounds.y - panContext.getTransform().y) / zoomScale,
            width: bounds.width / zoomScale,
            height: bounds.height / zoomScale,
        };

        return bounds;
    }
}
