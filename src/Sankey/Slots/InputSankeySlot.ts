import { SankeySlot } from "./SankeySlot";
import { SlotsGroup } from "../SlotsGroup";

export class InputSankeySlot extends SankeySlot
{
    public constructor(
        slotsGroup: SlotsGroup,
        slotsGroupSvg: SVGGElement,
        resource: RecipeResource,
        ...classes: string[])
    {
        super(slotsGroup, slotsGroupSvg, resource, "input-slot", ...classes);
    }
}
