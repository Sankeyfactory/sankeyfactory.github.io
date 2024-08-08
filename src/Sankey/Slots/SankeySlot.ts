import { Rectangle } from "../../Rectangle";
import { SvgFactory } from "../../SVG/SvgFactory";

export class SankeySlot
{
    public resourcesAmount: number = 0;
    public slotSvg: SVGElement;

    public static readonly slotWidth = 6;

    constructor(slotsGroup: SVGGElement, svgDimensions: Rectangle, ...classes: string[])
    {
        this.slotSvg = SvgFactory.createSvgRect(svgDimensions, ...classes);
        slotsGroup.appendChild(this.slotSvg);
    }
}
