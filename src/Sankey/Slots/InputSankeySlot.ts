import { SankeySlot } from "./SankeySlot";
import { SlotsGroup } from "../SlotsGroup";

export class InputSankeySlot extends SankeySlot
{
    constructor(
        slotsGroup: SlotsGroup,
        slotsGroupSvg: SVGGElement,
        resourcesAmount: number)
    {
        super(slotsGroup, slotsGroupSvg, resourcesAmount, "input-slot");
    }
}
