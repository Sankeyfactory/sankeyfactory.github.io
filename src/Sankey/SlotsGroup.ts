import { Point } from "../Point";
import { SankeyNode } from "./SankeyNode";
import { SankeySlot } from "./Slots/SankeySlot";
import { SankeySlotExceeding } from "./Slots/SankeySlotExceeding";
import { SankeySlotMissing } from "./Slots/SankeySlotMissing";
import { SvgFactory } from "../SVG/SvgFactory";

type SlotsGroupType = "input" | "output";

export class SlotsGroup
{
    public type: SlotsGroupType;

    public maxHeight: number;
    public resourcesAmount: number;
    public freeResourcesAmount: number;

    constructor(node: SankeyNode, type: SlotsGroupType, resourcesAmount: number)
    {
        this.type = type;
        this.resourcesAmount = resourcesAmount;
        this.freeResourcesAmount = resourcesAmount;

        let nodeHeight = +(node.nodeSvg.getAttribute("height") ?? "0");
        let nodeTotalResources = node.resourcesAmount;
        this.maxHeight = nodeHeight * (resourcesAmount / nodeTotalResources);

        let position = type === "input"
            ? new Point(0, 0)
            : new Point(SankeyNode.nodeWidth + SankeySlot.slotWidth, 0);

        let groupSvg = SvgFactory.createSvgGroup(position, `${type}-slots`);

        this.lastSlot = this.createLastSlot(groupSvg);

        node.nodeSvgGroup.appendChild(groupSvg);
    }

    private createLastSlot(groupSvg: SVGGElement): SankeySlotMissing | SankeySlotExceeding
    {
        if (this.type === "input")
        {
            return new SankeySlotMissing(this, groupSvg, this.freeResourcesAmount);
        }
        else if (this.type === "output")
        {
            return new SankeySlotExceeding(this, groupSvg, this.freeResourcesAmount);
        }
        else
        {
            throw Error("Unexpected slots group type");
        }
    }

    private lastSlot: SankeySlotExceeding | SankeySlotMissing;

    private slots: SankeySlot[] = [];
}
