import { Point } from "../Point";
import { SankeySlot } from "./Slots/SankeySlot";
import { SlotsGroup } from "./SlotsGroup";
import { SvgFactory } from "../SVG/SvgFactory";
import { GameRecipe } from "../GameData/GameRecipe";

// Ignore import error as the file only appears on launch of the exporting tool.
// @ts-ignore
import satisfactoryData from '../../dist/GameData/Satisfactory.json';

export class SankeyNode
{
    public nodeSvg: SVGElement;
    public nodeSvgGroup: SVGGElement;

    public static readonly nodeHeight = 260;
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

        let foreignObject = SvgFactory.createSvgForeignObject();

        foreignObject.setAttribute("x", "10");
        foreignObject.setAttribute("y", "0");
        foreignObject.setAttribute("width", `${SankeyNode.nodeWidth}`);
        foreignObject.setAttribute("height", `${SankeyNode.nodeHeight}`);


        let recipeContainer = document.createElement("div");
        recipeContainer.classList.add("recipe-container");


        let recipeNameProp = document.createElement("div");
        recipeNameProp.classList.add("property");

        let recipeNameTitle = document.createElement("div");
        recipeNameTitle.classList.add("title");
        recipeNameTitle.innerText = "Recipe";

        let recipeNameText = document.createElement("div");
        recipeNameText.classList.add("text");


        let recipeInputsProp = document.createElement("div");
        recipeInputsProp.classList.add("property");

        let recipeInputsTitle = document.createElement("div");
        recipeInputsTitle.classList.add("title");
        recipeInputsTitle.innerText = "Input/min";


        let recipeOutputsProp = document.createElement("div");
        recipeOutputsProp.classList.add("property");

        let recipeOutputsTitle = document.createElement("div");
        recipeOutputsTitle.classList.add("title");
        recipeOutputsTitle.innerText = "Output/min";



        recipeNameProp.appendChild(recipeNameTitle);
        recipeNameProp.appendChild(recipeNameText);

        recipeInputsProp.appendChild(recipeInputsTitle);

        recipeOutputsProp.appendChild(recipeOutputsTitle);

        recipeContainer.appendChild(recipeNameProp);
        recipeContainer.appendChild(recipeInputsProp);
        recipeContainer.appendChild(recipeOutputsProp);

        foreignObject.appendChild(recipeContainer);



        let createResourceDisplay = (parentDiv: HTMLDivElement, craftingTime: number) =>
        {
            return (recipeResource: RecipeResource) =>
            {
                let resource = satisfactoryData.resources.find(
                    (el: typeof satisfactoryData.resources[0]) =>
                    {
                        return el.id === recipeResource.id;
                    }
                );

                let resourceDiv = document.createElement("div");
                resourceDiv.classList.add("resource");

                let icon = document.createElement("img");
                icon.classList.add("icon");
                icon.loading = "lazy";
                icon.alt = resource!.displayName;
                icon.src = `GameData/SatisfactoryIcons/${resource!.iconPath}`;
                icon.title = resource!.displayName;

                let amount = document.createElement("p");
                amount.classList.add("amount");
                amount.innerText = `${+((60 / craftingTime) * recipeResource.amount).toPrecision(3)}`;

                resourceDiv.appendChild(icon);
                resourceDiv.appendChild(amount);
                parentDiv.appendChild(resourceDiv);
            };
        };



        recipeNameText.innerText = recipe.displayName;

        // let selectedRecipeMachine = document.querySelector("#selected-recipe-machine>div.machine>img.icon") as HTMLImageElement;
        // selectedRecipeMachine.src = `GameData/SatisfactoryIcons/${machine.iconPath}`;
        // selectedRecipeMachine.title = machine.displayName;

        recipe.ingredients.forEach(createResourceDisplay(recipeInputsProp, recipe.manufacturingDuration));

        recipe.products.forEach(createResourceDisplay(recipeOutputsProp, recipe.manufacturingDuration));

        // let selectedRecipePower = document.querySelector("#selected-recipe-power>div.text") as HTMLDivElement;
        // selectedRecipePower.innerText = `${machine.powerConsumption} MW`;



        this.nodeSvgGroup.appendChild(this.nodeSvg);

        this.nodeSvgGroup.appendChild(foreignObject);

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
