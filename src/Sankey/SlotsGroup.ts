import { Point } from "../Geometry/Point";
import { SankeyNode } from "./SankeyNode";
import { SankeySlot } from "./Slots/SankeySlot";
import { SankeySlotExceeding } from "./Slots/SankeySlotExceeding";
import { SankeySlotMissing } from "./Slots/SankeySlotMissing";
import { SvgFactory } from "../SVG/SvgFactory";
import { InputSankeySlot } from "./Slots/InputSankeySlot";
import { OutputSankeySlot } from "./Slots/OutputSankeySlot";

export type SlotsGroupType = "input" | "output";

export class SlotsGroup extends EventTarget
{
    public static readonly boundsChangedEvent = "bounds-changed";
    public static readonly changedVacantResourcesAmountEvent = "changed-vacant-resources-amount";

    public readonly parentNode: SankeyNode;
    public readonly slots: SankeySlot[] = [];
    public readonly type: SlotsGroupType;

    public constructor(
        node: SankeyNode,
        type: SlotsGroupType,
        resource: RecipeResource,
        startY: number)
    {
        super();

        this.type = type;
        this._resource = { ...resource };
        this.parentNode = node;

        let position = type === "input"
            ? new Point(0, startY)
            : new Point(SankeyNode.nodeWidth + SankeySlot.slotWidth, startY);

        this._groupSvg = SvgFactory.createSvgGroup(position, `${type}-slots`, "slots-group");

        this._lastSlot = this.initializeLastSlot(resource);

        node.nodeSvgGroup.appendChild(this._groupSvg);

        this.addEventListener(SlotsGroup.boundsChangedEvent, () =>
        {
            for (const slot of this.slots)
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

        if (this.type === "input")
        {
            newSlot = new InputSankeySlot(this, this._groupSvg, {
                id: this.resourceId,
                amount: resourcesAmount
            });
        }
        else if (this.type === "output")
        {
            newSlot = new OutputSankeySlot(this, this._groupSvg, {
                id: this.resourceId,
                amount: resourcesAmount
            });
        }
        else
        {
            throw Error("Unexpected slots group type");
        }

        this.slots.push(newSlot);

        newSlot.addEventListener(SankeySlot.deletionEvent, () =>
        {
            let index = this.slots.findIndex(slot => Object.is(slot, newSlot));

            this.slots.splice(index, 1);

            this.updateSlotPositions();
        });

        newSlot.addEventListener(SankeySlot.resourcesAmountChangedEvent, () =>
        {
            this.updateSlotPositions();
        });

        this.updateSlotPositions();

        return newSlot;
    }

    public delete()
    {
        // Don't use for/for-of because of iterator invalidation after array is spliced by event.
        while (this.slots.length !== 0)
        {
            this.slots[0].delete();
        }

        this._groupSvg.remove();
    }

    public get height(): number
    {
        let parentResourcesAmount: number;

        if (this.type == "input")
        {
            parentResourcesAmount = this.parentNode.inputResourcesAmount;
        }
        else
        {
            parentResourcesAmount = this.parentNode.outputResourcesAmount;
        }

        return this.parentNode.height * (this.resourcesAmount / parentResourcesAmount);
    }

    public get resourcesAmount(): number
    {
        return this._resource.amount;
    }

    public get vacantResourcesAmount(): number
    {
        return this._lastSlot.resourcesAmount;
    }

    public set resourcesAmount(value: number)
    {
        let subtractedResources = this._resource.amount - value;

        if (subtractedResources > 0)
        {
            {
                let smallerValue = Math.min(subtractedResources, this._lastSlot.resourcesAmount);

                subtractedResources -= smallerValue;
                this._lastSlot.resourcesAmount -= smallerValue;
            }

            for (let i = this.slots.length - 1; i >= 0 && subtractedResources > 0; --i)
            {
                let slot = this.slots[i];

                let smallerValue = Math.min(subtractedResources, slot.resourcesAmount);

                subtractedResources -= smallerValue;
                slot.resourcesAmount -= smallerValue;

                if (slot.resourcesAmount === 0)
                {
                    slot.delete();
                }
            }
        }

        this._resource.amount = value;
        this.updateSlotPositions();

        this.dispatchEvent(new Event(SlotsGroup.changedVacantResourcesAmountEvent));
    }

    public get resourceId(): string
    {
        return this._resource.id;
    }

    private updateSlotPositions(): void
    {
        let freeResourcesAmount = this.resourcesAmount;
        let nextYPosition = 0;

        for (const slot of this.slots)
        {
            slot.setYPosition(nextYPosition);
            slot.updateHeight();

            freeResourcesAmount -= slot.resourcesAmount;
            nextYPosition += +(slot.slotSvgRect.getAttribute("height") ?? 0);
        }

        this._lastSlot.setYPosition(nextYPosition);
        this._lastSlot.resourcesAmount = freeResourcesAmount;

        this.dispatchEvent(new Event(SlotsGroup.changedVacantResourcesAmountEvent));
    }

    /** Should be called only once. */
    private initializeLastSlot(resource: RecipeResource): SankeySlotMissing | SankeySlotExceeding
    {
        if (this.type === "input")
        {
            return new SankeySlotMissing(this, this._groupSvg, { ...resource });
        }
        else if (this.type === "output")
        {
            return new SankeySlotExceeding(this, this._groupSvg, { ...resource });
        }
        else
        {
            throw Error("Unexpected slots group type");
        }
    }

    private _resource: RecipeResource;

    private _lastSlot: SankeySlotExceeding | SankeySlotMissing;

    private _groupSvg: SVGGElement;
}
