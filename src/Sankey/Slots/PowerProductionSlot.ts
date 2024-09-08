import { SlotsGroup } from "../SlotsGroup";
import { OutputSankeySlot } from "./OutputSankeySlot";
import { SankeySlot } from "./SankeySlot";
import { SlotResourcesDisplay } from "./SlotResourcesDisplay";

export class PowerProductionSlot extends OutputSankeySlot
{
    public constructor(
        slotsGroup: SlotsGroup,
        slotsGroupSvg: SVGGElement,
        resource: RecipeResource,
        ...classes: string[])
    {
        super(slotsGroup, slotsGroupSvg, resource, "output-slot", "power", ...classes);

        this._resourcesDisplay = new SlotResourcesDisplay(this, slotsGroupSvg, "output");
    }

    public updateHeight(): void
    {
        if (this.parentGroup.parentNode.recipe.products.length === 0)
        {
            this.slotSvgRect.setAttribute("height", `${this.parentGroup.parentNode.height}`);
        }
        else
        {
            this.slotSvgRect.setAttribute("height", "30");
        }

        this.dispatchEvent(new Event(SankeySlot.boundsChangedEvent));
    }

    private _resourcesDisplay: SlotResourcesDisplay;
}
