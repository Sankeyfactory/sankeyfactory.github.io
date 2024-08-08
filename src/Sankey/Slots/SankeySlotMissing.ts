import { InputSankeySlot } from "./InputSankeySlot";
import { SlotsGroup } from "../SlotsGroup";

export class SankeySlotMissing extends InputSankeySlot
{
    constructor(
        slotsGroup: SlotsGroup,
        slotsGroupSvg: SVGGElement,
        resourcesAmount: number)
    {
        super(slotsGroup, slotsGroupSvg, resourcesAmount);

        this.slotSvg.classList.add("missing");

        this.slotSvg.onclick = (event) =>
        {
            // Just for testing.
            slotsGroup.addSlot(30);
        };
    }
}
