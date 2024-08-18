import { SankeySlot } from "./SankeySlot";
import { SlotsGroup } from "../SlotsGroup";

export class OutputSankeySlot extends SankeySlot
{
    constructor(
        slotsGroup: SlotsGroup,
        slotsGroupSvg: SVGGElement,
        resourcesAmount: number,
        ...classes: string[])
    {
        super(slotsGroup, slotsGroupSvg, resourcesAmount, "output-slot", ...classes);
    }
}
