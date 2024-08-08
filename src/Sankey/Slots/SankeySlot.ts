import { Rectangle } from "../../Rectangle";
import { SvgFactory } from "../../SVG/SvgFactory";
import { SlotsGroup } from "../SlotsGroup";

export class SankeySlot
{
    public resourcesAmount: number = 0;
    public slotSvg: SVGElement;

    public static readonly slotWidth = 6;

    constructor(slotsGroup: SlotsGroup,
        slotsGroupSvg: SVGGElement,
        resourcesAmount: number, ...classes: string[])
    {
        let maxHeight = slotsGroup.maxHeight;
        let freeResourcesAmount = slotsGroup.freeResourcesAmount;
        let usedResourcesAmount = slotsGroup.resourcesAmount - freeResourcesAmount;

        if (freeResourcesAmount < resourcesAmount)
        {
            resourcesAmount = freeResourcesAmount;
        }

        let dimensions: Rectangle = {
            width: SankeySlot.slotWidth,
            height: maxHeight * (resourcesAmount / slotsGroup.resourcesAmount),
            x: 0,
            y: maxHeight * (usedResourcesAmount / slotsGroup.resourcesAmount)
        };

        this.slotSvg = SvgFactory.createSvgRect(dimensions, ...classes);
        slotsGroupSvg.appendChild(this.slotSvg);
    }
}
