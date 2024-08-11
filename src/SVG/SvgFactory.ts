import { Point } from "../Point";
import { Rectangle } from "../Rectangle";

export abstract class SvgFactory
{
    public static createSvgGroup(position: Point, ...classes: string[]): SVGGElement
    {
        let result = this.createSvgElement("g", ...classes) as SVGGElement;
        result.setAttribute("transform", `translate(${position.x}, ${position.y})`);
        return result;
    }

    public static createSvgRect(dimensions: Rectangle, ...classes: string[]): SVGRectElement
    {
        let result = this.createSvgElement("rect", ...classes) as SVGRectElement;

        result.setAttribute("width", `${dimensions.width}`);
        result.setAttribute("height", `${dimensions.height}`);
        result.setAttribute("x", `${dimensions.x}`);
        result.setAttribute("y", `${dimensions.y}`);

        return result;
    }

    public static createSvgLine(startPos: Point, endPos: Point, ...classes: string[]): SVGLineElement
    {
        let result = this.createSvgElement("line", ...classes) as SVGLineElement;

        result.setAttribute("x1", `${startPos.x}`);
        result.setAttribute("y1", `${startPos.y}`);
        result.setAttribute("x2", `${endPos.x}`);
        result.setAttribute("y2", `${endPos.y}`);

        return result;
    }

    public static createSvgPath(...classes: string[]): SVGPathElement
    {
        let result = this.createSvgElement("path", ...classes) as SVGPathElement;

        result.setAttribute("g", "");

        return result;
    }

    private static createSvgElement(tag: string, ...classes: string[]): SVGElement
    {
        let result = document.createElementNS("http://www.w3.org/2000/svg", tag);

        result.classList.add(...classes);

        return result;
    }
}
