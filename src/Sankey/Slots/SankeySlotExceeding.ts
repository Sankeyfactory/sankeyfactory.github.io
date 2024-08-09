import { OutputSankeySlot } from "./OutputSankeySlot";
import { SlotsGroup } from "../SlotsGroup";
import { MouseHandler } from "../../MouseHandler";

export class SankeySlotExceeding extends OutputSankeySlot
{
    constructor(
        slotsGroup: SlotsGroup,
        slotsGroupSvg: SVGGElement,
        resourcesAmount: number)
    {
        super(slotsGroup, slotsGroupSvg, resourcesAmount);

        this.slotSvg.classList.add("exceeding");

        this.slotSvg.onmousedown = (event) =>
        {
            if (!event.altKey && event.buttons === 1)
            {
                MouseHandler.getInstance().outputSlotClicked(event, this);
            }
        };
    }
}
