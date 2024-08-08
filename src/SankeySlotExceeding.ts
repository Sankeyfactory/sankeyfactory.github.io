import { OutputSankeySlot } from "./OutputSankeySlot";
import { SlotsGroup } from "./SlotsGroup";

export class SankeySlotExceeding extends OutputSankeySlot
{
    constructor(
        slotsGroup: SlotsGroup,
        slotsGroupSvg: SVGGElement,
        resourcesAmount: number)
    {
        super(slotsGroup, slotsGroupSvg, resourcesAmount);

        this.slotSvg.classList.add("exceeding");
    }
}
