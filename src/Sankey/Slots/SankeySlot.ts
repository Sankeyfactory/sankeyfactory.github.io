import { Rectangle } from "../../Rectangle";
import { SvgFactory } from "../../SVG/SvgFactory";
import { SankeyLink } from "../SankeyLink";
import { SlotsGroup } from "../SlotsGroup";

export class SankeySlot
{
    public resourcesAmount: number;
    public slotSvg: SVGElement;

    public connectedLink: SankeyLink | undefined;

    public static readonly slotWidth = 10;

    public readonly parentGroup: SlotsGroup;

    constructor(
        slotsGroup: SlotsGroup,
        slotsGroupSvg: SVGGElement,
        resourcesAmount: number,
        ...classes: string[])
    {
        this.resourcesAmount = resourcesAmount;
        this.parentGroup = slotsGroup;

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
