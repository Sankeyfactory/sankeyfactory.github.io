import { Point } from "../Point";
import { SankeySlot } from "./Slots/SankeySlot";
import { SlotsGroup } from "./SlotsGroup";
import { SvgFactory } from "../SVG/SvgFactory";
import { GameRecipe } from "../GameData/GameRecipe";
import { GameMachine } from "../GameData/GameMachine";

export class SankeyNode
{
    public nodeSvg: SVGElement;
    public nodeSvgGroup: SVGGElement;

    public static readonly nodeHeight = 240;
    public static readonly nodeWidth = 60;

    constructor(
        parentGroup: SVGGElement,
        position: Point,
        recipe: GameRecipe,
    )
    {
        this.nodeSvgGroup = SvgFactory.createSvgGroup(position, "node");

        this.nodeSvg = SvgFactory.createSvgRect({
            width: SankeyNode.nodeWidth,
            height: SankeyNode.nodeHeight,
            x: SankeySlot.slotWidth,
            y: 0
        }, "machine");

        let totalInputResourcesAmount = recipe.ingredients
            .reduce((sum, ingredient) =>
            {
                return sum + toItemsInMinute(ingredient.amount, recipe.manufacturingDuration);
            }, 0);

        let totalOutputResourcesAmount = recipe.products
            .reduce((sum, product) =>
            {
                return sum + toItemsInMinute(product.amount, recipe.manufacturingDuration);
            }, 0);

        let nextInputGroupY = 0;

        for (const ingredient of recipe.ingredients)
        {
            let newGroup = new SlotsGroup(
                this,
                "input",
                toItemsInMinute(ingredient.amount, recipe.manufacturingDuration),
                totalInputResourcesAmount,
                nextInputGroupY
            );

            this.inputSlotGroups.push(newGroup);

            nextInputGroupY += newGroup.maxHeight;
        }

        let nextOutputGroupY = 0;

        for (const product of recipe.products)
        {
            let newGroup = new SlotsGroup(
                this,
                "output",
                toItemsInMinute(product.amount, recipe.manufacturingDuration),
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

function toItemsInMinute(amount: number, consumingTime: number): number
{
    return (60 / consumingTime) * amount;
}
