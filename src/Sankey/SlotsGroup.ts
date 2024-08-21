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

    public type: SlotsGroupType;

    public maxHeight: number;
    public readonly resource: RecipeResource;

    constructor(
        node: SankeyNode,
        type: SlotsGroupType,
        resource: RecipeResource,
        nodeResourcesAmount: number,
        startY: number)
    {
        super();

        this.type = type;
        this.resource = resource;

        let nodeHeight = +(node.nodeSvg.getAttribute("height") ?? 0);
        this.maxHeight = nodeHeight * (resource.amount / nodeResourcesAmount);

        let position = type === "input"
            ? new Point(0, startY)
            : new Point(SankeyNode.nodeWidth + SankeySlot.slotWidth, startY);

        this.groupSvg = SvgFactory.createSvgGroup(position, `${type}-slots`);

        this.lastSlot = this.initializeLastSlot();

        node.nodeSvgGroup.appendChild(this.groupSvg);

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
        resourcesAmount = Math.min(resourcesAmount, this.lastSlot.resourcesAmount);

        this.lastSlot.resourcesAmount -= resourcesAmount;

        let newSlot: SankeySlot;

        if (this.type === "input")
        {
            newSlot = new InputSankeySlot(this, this.groupSvg, {
                id: this.resource.id,
                amount: resourcesAmount,
            });
        }
        else if (this.type === "output")
        {
            newSlot = new OutputSankeySlot(this, this.groupSvg, {
                id: this.resource.id,
                amount: resourcesAmount,
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

        this.groupSvg.remove();
    }

    private updateSlotPositions(): void
    {
        let freeResourcesAmount = this.resource.amount;
        let nextYPosition = 0;

        for (const slot of this.slots)
        {
            slot.setYPosition(nextYPosition);

            freeResourcesAmount -= slot.resourcesAmount;
            nextYPosition += +(slot.slotSvgRect.getAttribute("height") ?? 0);
        }

        this.lastSlot.setYPosition(nextYPosition);
        this.lastSlot.resourcesAmount = freeResourcesAmount;
    }

    private initializeLastSlot(): SankeySlotMissing | SankeySlotExceeding
    {
        if (this.type === "input")
        {
            return new SankeySlotMissing(this, this.groupSvg, { ...this.resource });
        }
        else if (this.type === "output")
        {
            return new SankeySlotExceeding(this, this.groupSvg, { ...this.resource });
        }
        else
        {
            throw Error("Unexpected slots group type");
        }
    }

    private groupSvg: SVGGElement;

    private lastSlot: SankeySlotExceeding | SankeySlotMissing;

    private slots: SankeySlot[] = [];
}
