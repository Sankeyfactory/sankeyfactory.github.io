import { Point } from "../Point";
import { SankeySlot } from "./Slots/SankeySlot";
import { SlotsGroup } from "./SlotsGroup";
import { SvgFactory } from "../SVG/SvgFactory";

function sumOfNumbers(array: number[])
{
    let result = 0;

    for (let resourcesAmount of array)
    {
        result += resourcesAmount;
    }

    return result;
}

export class SankeyNode
{
    public nodeSvg: SVGElement;
    public nodeSvgGroup: SVGGElement;

    public static readonly nodeHeight = 240;
    public static readonly nodeWidth = 60;

    constructor(
        parentGroup: SVGGElement,
        position: Point,
        inputResourcesAmount: number[],
        outputResourcesAmount: number[],)
    {
        this.nodeSvgGroup = SvgFactory.createSvgGroup(position, "node");

        this.nodeSvg = SvgFactory.createSvgRect({
            width: SankeyNode.nodeWidth,
            height: SankeyNode.nodeHeight,
            x: SankeySlot.slotWidth,
            y: 0
        }, "machine");

        let totalInputResourcesAmount = sumOfNumbers(inputResourcesAmount);
        let totalOutputResourcesAmount = sumOfNumbers(outputResourcesAmount);

        let nextInputGroupY = 0;

        for (const resourcesAmount of inputResourcesAmount)
        {
            let newGroup = new SlotsGroup(
                this,
                "input",
                resourcesAmount,
                totalInputResourcesAmount,
                nextInputGroupY
            );

            this.inputSlotGroups.push(newGroup);

            nextInputGroupY += newGroup.maxHeight;
        }

        let nextOutputGroupY = 0;

        for (const resourcesAmount of outputResourcesAmount)
        {
            let newGroup = new SlotsGroup(
                this,
                "output",
                resourcesAmount,
                totalOutputResourcesAmount,
                nextOutputGroupY);

            this.outputSlotGroups.push(newGroup);

            nextOutputGroupY += newGroup.maxHeight;
        }

        this.nodeSvgGroup.appendChild(this.nodeSvg);
        parentGroup.appendChild(this.nodeSvgGroup);
    }

    public recalculateLinks()
    {
        let recalculateGroup = (group: SlotsGroup) =>
        {
            group.recalculateLinks();
        };

        this.inputSlotGroups.forEach(recalculateGroup);
        this.outputSlotGroups.forEach(recalculateGroup);
    }

    private inputSlotGroups: SlotsGroup[] = [];
    private outputSlotGroups: SlotsGroup[] = [];
}
