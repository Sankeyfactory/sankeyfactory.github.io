import { SankeySlot } from "./SankeySlot";
import { SlotsGroup } from "../SlotsGroup";

export class OutputSankeySlot extends SankeySlot
{
    public constructor(
        slotsGroup: SlotsGroup,
        slotsGroupSvg: SVGGElement,
        resource: RecipeResource,
        ...classes: string[])
    {
        super(slotsGroup, slotsGroupSvg, resource, "output-slot", ...classes);
    }
}
