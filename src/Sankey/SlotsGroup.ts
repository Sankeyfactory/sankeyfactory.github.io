import { Point } from "../Geometry/Point";
import { SankeyNode } from "./SankeyNode";
import { SankeySlot } from "./Slots/SankeySlot";
import { SankeySlotExceeding } from "./Slots/SankeySlotExceeding";
import { SankeySlotMissing } from "./Slots/SankeySlotMissing";
import { SvgFactory } from "../SVG/SvgFactory";
import { InputSankeySlot } from "./Slots/InputSankeySlot";
import { OutputSankeySlot } from "./Slots/OutputSankeySlot";
import { AppData } from "../AppData";

export type SlotsGroupType = "input" | "output";

export class SlotsGroup extends EventTarget
{
    public static readonly boundsChangedEvent = "bounds-changed";
    public static readonly changedVacantResourcesAmountEvent = "changed-vacant-resources-amount";

    public constructor(
        node: SankeyNode,
        type: SlotsGroupType,
        resource: RecipeResource,
        startY: number)
    {
        super();

        this._type = type;
        this._resource = { ...resource };
        this._parentNode = node;

        let position = type === "input"
            ? new Point(0, startY)
            : new Point(SankeyNode.nodeWidth + SankeySlot.slotWidth, startY);

        this._groupSvg = SvgFactory.createSvgGroup(position, `${type}-slots`, "slots-group");

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
                id: this.resourceId,
                amount: resourcesAmount
            });
        }
        else if (this._type === "output")
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

        this._slots.push(newSlot);

        newSlot.addEventListener(SankeySlot.deletionEvent, () =>
        {
            let index = this._slots.findIndex(slot => Object.is(slot, newSlot));

            this._slots.splice(index, 1);

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
        AppData.lockSaving();

        // Don't use for/for-of because of iterator invalidation after array is spliced by event.
        while (this._slots.length !== 0)
        {
            this._slots[0].delete();
        }

        this._groupSvg.remove();

        AppData.unlockSaving();

        AppData.saveToUrl();
    }

    public toSerializable(): AppData.SerializableSlotsGroup
    {
        let connectedSlots: AppData.SerializableConnectedSlot[] = [];

        for (const slot of this._slots)
        {
            connectedSlots.push(slot.toSerializable());
        }

        return { resourceId: this.resourceId, connectedOutputs: connectedSlots };
    }

    public get height(): number
    {
        let parentResourcesAmount: number;

        if (this._type == "input")
        {
            parentResourcesAmount = this._parentNode.inputResourcesAmount;
        }
        else
        {
            parentResourcesAmount = this._parentNode.outputResourcesAmount;
        }

        return this._parentNode.height * (this.resourcesAmount / parentResourcesAmount);
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

            for (let i = this._slots.length - 1; i >= 0 && subtractedResources > 0; --i)
            {
                let slot = this._slots[i];

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

    public get parentNode(): SankeyNode
    {
        return this._parentNode;
    }

    private updateSlotPositions(): void
    {
        let freeResourcesAmount = this.resourcesAmount;
        let nextYPosition = 0;

        for (const slot of this._slots)
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

    private _resource: RecipeResource;

    private _slots: SankeySlot[] = [];
    private _lastSlot: SankeySlotExceeding | SankeySlotMissing;

    private _groupSvg: SVGGElement;

    private _parentNode: SankeyNode;
}
