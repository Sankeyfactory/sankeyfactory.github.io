import { InputSankeySlot } from "./InputSankeySlot";
import { SlotsGroup } from "../SlotsGroup";
import { MouseHandler } from "../../MouseHandler";

export class SankeySlotMissing extends InputSankeySlot
{
    constructor(
        slotsGroup: SlotsGroup,
        slotsGroupSvg: SVGGElement,
        resourcesAmount: number)
    {
        super(slotsGroup, slotsGroupSvg, resourcesAmount);

        this.slotSvg.classList.add("missing");

        this.slotSvg.onmousedown = (event) =>
        {
            if (!event.altKey && event.buttons === 1)
            {
                MouseHandler.getInstance().inputSlotClicked(event, this);
            }
        };
    }
}
