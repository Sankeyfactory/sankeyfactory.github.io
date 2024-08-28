import { OutputSankeySlot } from "./OutputSankeySlot";
import { SlotsGroup } from "../SlotsGroup";
import { MouseHandler } from "../../MouseHandler";
import { SankeySlot } from "./SankeySlot";
import { PanZoomConfiguration } from "../../PanZoomConfiguration";
import { SlotResourcesDisplay } from "./SlotResourcesDisplay";

export class SankeySlotExceeding extends OutputSankeySlot
{
    public constructor(
        slotsGroup: SlotsGroup,
        slotsGroupSvg: SVGGElement,
        resource: RecipeResource)
    {
        super(slotsGroup, slotsGroupSvg, resource, "exceeding");

        this._resourcesDisplay = new SlotResourcesDisplay(this, slotsGroupSvg, false);

        this.slotSvgRect.addEventListener("click", (event) =>
        {
            if (!PanZoomConfiguration.isPanning && !PanZoomConfiguration.isZooming)
            {
                MouseHandler.getInstance().outputSlotClicked(event, this);
            }
        });

        this.slotSvgRect.addEventListener("dblclick", (event) =>
        {
            event.stopPropagation();
        });
    }

    public splitOffSlot(resourcesAmount: number): SankeySlot
    {
        return this.parentGroup.addSlot(resourcesAmount);
    }

    private _resourcesDisplay: SlotResourcesDisplay;
}
