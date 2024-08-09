export class Rectangle
{
    constructor(
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
}
