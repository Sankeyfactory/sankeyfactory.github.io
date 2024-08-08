import { Rectangle } from "../../Rectangle";
import { SvgFactory } from "../../SVG/SvgFactory";
import { SlotsGroup } from "../SlotsGroup";

export class SankeySlot
{
    public resourcesAmount: number;
    public slotSvg: SVGElement;

    public static readonly slotWidth = 6;

    constructor(
        slotsGroup: SlotsGroup,
        slotsGroupSvg: SVGGElement,
        resourcesAmount: number,
        ...classes: string[])
    {
        this.resourcesAmount = resourcesAmount;

        let dimensions: Rectangle = {
            width: SankeySlot.slotWidth,
            height: slotsGroup.maxHeight * (resourcesAmount / slotsGroup.resourcesAmount),
            x: 0,
            y: 0
        };

        this.slotSvg = SvgFactory.createSvgRect(dimensions, ...classes);
        slotsGroupSvg.appendChild(this.slotSvg);
    }

    public setYPosition(yPosition: number)
    {
        this.slotSvg.setAttribute("y", `${yPosition}`);
    }

    public setResourcesAmount(slotsGroup: SlotsGroup, resourcesAmount: number)
    {
        this.slotSvg.setAttribute(
            "height",
            `${slotsGroup.maxHeight * (resourcesAmount / slotsGroup.resourcesAmount)}`
        );
    }
}
