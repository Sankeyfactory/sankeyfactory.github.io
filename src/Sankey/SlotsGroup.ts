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
    public resourcesAmount: number;

    constructor(
        node: SankeyNode,
        type: SlotsGroupType,
        resourcesAmount: number,
        nodeResourcesAmount: number,
        startY: number)
    {
        super();

        this.type = type;
        this.resourcesAmount = resourcesAmount;

        let nodeHeight = +(node.nodeSvg.getAttribute("height") ?? 0);
        this.maxHeight = nodeHeight * (resourcesAmount / nodeResourcesAmount);

        let position = type === "input"
            ? new Point(0, startY)
            : new Point(SankeyNode.nodeWidth + SankeySlot.slotWidth, startY);

        this.groupSvg = SvgFactory.createSvgGroup(position, `${type}-slots`);

        this.lastSlot = this.createLastSlot();

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
            newSlot = new InputSankeySlot(this, this.groupSvg, resourcesAmount);
        }
        else if (this.type === "output")
        {
            newSlot = new OutputSankeySlot(this, this.groupSvg, resourcesAmount);
        }
        else
        {
            throw Error("Unexpected slots group type");
        }

        this.slots.push(newSlot);
        this.updateSlotPositions();

        return newSlot;
    }

    private updateSlotPositions(): void
    {
        let freeResourcesAmount = this.resourcesAmount;
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

    private createLastSlot(): SankeySlotMissing | SankeySlotExceeding
    {
        if (this.type === "input")
        {
            return new SankeySlotMissing(this, this.groupSvg, this.resourcesAmount);
        }
        else if (this.type === "output")
        {
            return new SankeySlotExceeding(this, this.groupSvg, this.resourcesAmount);
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
