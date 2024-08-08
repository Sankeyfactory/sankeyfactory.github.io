import { Point } from "../Point";
import { SankeySlot } from "./Slots/SankeySlot";
import { SlotsGroup } from "./SlotsGroup";
import { SvgFactory } from "../SVG/SvgFactory";

export class SankeyNode
{
    public nodeSvg: SVGElement;
    public nodeSvgGroup: SVGGElement;
    public resourcesAmount: number;

    public static readonly nodeHeight = 240;
    public static readonly nodeWidth = 60;

    constructor(resourcesAmount: number, position: Point, parentGroup: SVGGElement)
    {
        this.resourcesAmount = resourcesAmount;

        this.nodeSvgGroup = SvgFactory.createSvgGroup(position, "node");

        this.nodeSvg = SvgFactory.createSvgRect({
            width: SankeyNode.nodeWidth,
            height: SankeyNode.nodeHeight,
            x: SankeySlot.slotWidth,
            y: 0
        }, "machine");

        this.inputSlots = new SlotsGroup(this, "input", resourcesAmount);
        this.outputSlots = new SlotsGroup(this, "output", resourcesAmount);

        this.nodeSvgGroup.appendChild(this.nodeSvg);
        parentGroup.appendChild(this.nodeSvgGroup);
    }

    private inputSlots: SlotsGroup;
    private outputSlots: SlotsGroup;
}
