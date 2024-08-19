import { InputSankeySlot } from "./InputSankeySlot";
import { SlotsGroup } from "../SlotsGroup";
import { MouseHandler } from "../../MouseHandler";
import { SankeySlot } from "./SankeySlot";

export class SankeySlotMissing extends InputSankeySlot
{
    constructor(
        slotsGroup: SlotsGroup,
        slotsGroupSvg: SVGGElement,
        resource: RecipeResource)
    {
        super(slotsGroup, slotsGroupSvg, resource, "missing");

        this.slotSvgRect.addEventListener("click", (event) =>
        {
            if (!event.altKey)
            {
                MouseHandler.getInstance().inputSlotClicked(event, this);
            }
        });
    }

    public splitOffSlot(resourcesAmount: number): SankeySlot
    {
        return this.parentGroup.addSlot(resourcesAmount);
    }
}
