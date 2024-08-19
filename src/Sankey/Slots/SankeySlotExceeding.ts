import { OutputSankeySlot } from "./OutputSankeySlot";
import { SlotsGroup } from "../SlotsGroup";
import { MouseHandler } from "../../MouseHandler";
import { SankeySlot } from "./SankeySlot";

export class SankeySlotExceeding extends OutputSankeySlot
{
    constructor(
        slotsGroup: SlotsGroup,
        slotsGroupSvg: SVGGElement,
        resource: RecipeResource)
    {
        super(slotsGroup, slotsGroupSvg, resource, "exceeding");

        this.slotSvgRect.addEventListener("click", (event) =>
        {
            if (!event.altKey)
            {
                MouseHandler.getInstance().outputSlotClicked(event, this);
            }
        });
    }

    public splitOffSlot(resourcesAmount: number): SankeySlot
    {
        return this.parentGroup.addSlot(resourcesAmount);
    }
}
