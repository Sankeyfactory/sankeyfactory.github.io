import { SankeySlot } from "./SankeySlot";
import { SlotsGroup } from "../SlotsGroup";

export class OutputSankeySlot extends SankeySlot
{
    constructor(
        slotsGroup: SlotsGroup,
        slotsGroupSvg: SVGGElement,
        resourcesAmount: number)
    {
        let maxHeight = slotsGroup.maxHeight;
        let freeResourcesAmount = slotsGroup.freeResourcesAmount;
        let usedResourcesAmount = slotsGroup.resourcesAmount - freeResourcesAmount;

        if (freeResourcesAmount < resourcesAmount)
        {
            resourcesAmount = freeResourcesAmount;
        }

        super(slotsGroupSvg, {
            width: SankeySlot.slotWidth,
            height: maxHeight * (resourcesAmount / slotsGroup.resourcesAmount),
            x: 0,
            y: maxHeight * (usedResourcesAmount / slotsGroup.resourcesAmount)
        }, "output-slot");
    }
}
