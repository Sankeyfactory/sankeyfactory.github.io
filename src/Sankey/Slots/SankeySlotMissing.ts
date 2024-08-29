import { InputSankeySlot } from "./InputSankeySlot";
import { SlotsGroup } from "../SlotsGroup";
import { MouseHandler } from "../../MouseHandler";
import { SankeySlot } from "./SankeySlot";
import { PanZoomConfiguration } from "../../PanZoomConfiguration";
import { SlotResourcesDisplay } from "./SlotResourcesDisplay";

export class SankeySlotMissing extends InputSankeySlot
{
    public constructor(
        slotsGroup: SlotsGroup,
        slotsGroupSvg: SVGGElement,
        resource: RecipeResource)
    {
        super(slotsGroup, slotsGroupSvg, resource, "missing");

        this._resourcesDisplay = new SlotResourcesDisplay(this, slotsGroupSvg, "input");

        this.slotSvgRect.addEventListener("click", (event) =>
        {
            if (!PanZoomConfiguration.isPanning && !PanZoomConfiguration.isZooming)
            {
                MouseHandler.getInstance().inputSlotClicked(event, this);
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
