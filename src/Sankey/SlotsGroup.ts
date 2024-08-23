import { Point } from "../Point";
import { SankeyNode } from "./SankeyNode";
import { SankeySlot } from "./Slots/SankeySlot";
import { SankeySlotExceeding } from "./Slots/SankeySlotExceeding";
import { SankeySlotMissing } from "./Slots/SankeySlotMissing";
import { SvgFactory } from "../SVG/SvgFactory";
import { InputSankeySlot } from "./Slots/InputSankeySlot";
import { OutputSankeySlot } from "./Slots/OutputSankeySlot";

type SlotsGroupType = "input" | "output";

export class SlotsGroup extends EventTarget
{
    public static readonly boundsChangedEvent = "bounds-changed";

    constructor(
        node: SankeyNode,
        type: SlotsGroupType,
        resource: RecipeResource,
        nodeResourcesAmount: number,
        startY: number)
    {
        super();

        this._type = type;
        this._resourceId = resource.id;
        this._resourcesAmount = resource.amount;

        let nodeHeight = +(node.nodeSvg.getAttribute("height") ?? 0);
        this._expectedHeight = nodeHeight * (resource.amount / nodeResourcesAmount);

        let position = type === "input"
            ? new Point(0, startY)
            : new Point(SankeyNode.nodeWidth + SankeySlot.slotWidth, startY);

        this._groupSvg = SvgFactory.createSvgGroup(position, `${type}-slots`);

        this._lastSlot = this.initializeLastSlot(resource);

        node.nodeSvgGroup.appendChild(this._groupSvg);

        this.addEventListener(SlotsGroup.boundsChangedEvent, () =>
        {
            for (const slot of this._slots)
            {
                slot.dispatchEvent(new Event(SankeySlot.boundsChangedEvent));
            }
        });
    }

    public addSlot(resourcesAmount: number): SankeySlot
    {
        resourcesAmount = Math.min(resourcesAmount, this._lastSlot.resourcesAmount);

        this._lastSlot.resourcesAmount -= resourcesAmount;

        let newSlot: SankeySlot;

        if (this._type === "input")
        {
            newSlot = new InputSankeySlot(this, this._groupSvg, {
                id: this._resourceId,
                amount: resourcesAmount,
            });
        }
        else if (this._type === "output")
        {
            newSlot = new OutputSankeySlot(this, this._groupSvg, {
                id: this._resourceId,
                amount: resourcesAmount,
            });
        }
        else
        {
            throw Error("Unexpected slots group type");
        }

        this._slots.push(newSlot);

        newSlot.addEventListener(SankeySlot.deletionEvent, () =>
        {
            let index = this._slots.findIndex(slot => Object.is(slot, newSlot));

            this._slots.splice(index, 1);

            this.updateSlotPositions();
        });

        this.updateSlotPositions();

        return newSlot;
    }

    public delete()
    {
        // Don't use for/for-of because of iterator invalidation after array is spliced by event.
        while (this._slots.length !== 0)
        {
            this._slots[0].delete();
        }

        this._groupSvg.remove();
    }

    public get expectedHeight(): number
    {
        return this._expectedHeight;
    }

    public get resourcesAmount(): number
    {
        return this._resourcesAmount;
    }

    private updateSlotPositions(): void
    {
        let freeResourcesAmount = this.resourcesAmount;
        let nextYPosition = 0;

        for (const slot of this._slots)
        {
            slot.setYPosition(nextYPosition);

            freeResourcesAmount -= slot.resourcesAmount;
            nextYPosition += +(slot.slotSvgRect.getAttribute("height") ?? 0);
        }

        this._lastSlot.setYPosition(nextYPosition);
        this._lastSlot.resourcesAmount = freeResourcesAmount;
    }

    /** Should be called only once. */
    private initializeLastSlot(resource: RecipeResource): SankeySlotMissing | SankeySlotExceeding
    {
        if (this._type === "input")
        {
            return new SankeySlotMissing(this, this._groupSvg, { ...resource });
        }
        else if (this._type === "output")
        {
            return new SankeySlotExceeding(this, this._groupSvg, { ...resource });
        }
        else
        {
            throw Error("Unexpected slots group type");
        }
    }

    private _type: SlotsGroupType;

    private readonly _resourceId: string;
    private _resourcesAmount: number;

    private _slots: SankeySlot[] = [];
    private _lastSlot: SankeySlotExceeding | SankeySlotMissing;

    private _groupSvg: SVGGElement;

    private _expectedHeight: number;
}
