import { SankeySlot } from "./SankeySlot";
import { SlotsGroup } from "../SlotsGroup";

export class OutputSankeySlot extends SankeySlot
{
    constructor(
        slotsGroup: SlotsGroup,
        slotsGroupSvg: SVGGElement,
        resourcesAmount: number)
    {
        super(slotsGroup, slotsGroupSvg, resourcesAmount, "output-slot");
    }
}
