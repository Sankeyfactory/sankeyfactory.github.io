// Ignore import error as the file only appears on launch of the exporting tool.
// @ts-ignore
import satisfactoryData from '../../dist/GameData/Satisfactory.json';

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

    public static readonly nodeHeight = 260;
    public static readonly nodeWidth = 60;

    constructor(
        parentGroup: SVGGElement,
        position: Point,
        recipe: GameRecipe,
        machine: GameMachine,
    )
    {
        this.nodeSvgGroup = SvgFactory.createSvgGroup({
            x: position.x - SankeyNode.nodeWidth / 2 - SankeySlot.slotWidth,
            y: position.y - SankeyNode.nodeHeight / 2
        }, "node", "animate-appearance");

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
                {
                    id: ingredient.id,
                    amount: toItemsInMinute(ingredient.amount, recipe.manufacturingDuration)
                },
                totalInputResourcesAmount,
                nextInputGroupY
            );

            this._inputSlotGroups.push(newGroup);

            nextInputGroupY += newGroup.maxHeight;
        }

        let nextOutputGroupY = 0;

        for (const product of recipe.products)
        {
            let newGroup = new SlotsGroup(
                this,
                "output",
                {
                    id: product.id,
                    amount: toItemsInMinute(product.amount, recipe.manufacturingDuration)
                },
                totalOutputResourcesAmount,
                nextOutputGroupY);

            this._outputSlotGroups.push(newGroup);

            nextOutputGroupY += newGroup.maxHeight;
        }

        let foreignObject = SvgFactory.createSvgForeignObject();

        foreignObject.setAttribute("x", "10");
        foreignObject.setAttribute("y", "0");
        foreignObject.setAttribute("width", `${SankeyNode.nodeWidth}`);
        foreignObject.setAttribute("height", `${SankeyNode.nodeHeight}`);


        let recipeContainer = document.createElement("div");
        recipeContainer.classList.add("recipe-container");


        let recipeMachineProp = document.createElement("div");
        recipeMachineProp.classList.add("property");

        let recipeMachineTitle = document.createElement("div");
        recipeMachineTitle.classList.add("title");
        recipeMachineTitle.innerText = "Machine";

        let recipeMachineValue = document.createElement("div");
        recipeMachineValue.classList.add("machine");

        let recipeMachineIcon = document.createElement("img");
        recipeMachineIcon.classList.add("icon");


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


        let recipePowerProp = document.createElement("div");
        recipePowerProp.classList.add("property");

        let recipePowerTitle = document.createElement("div");
        recipePowerTitle.classList.add("title");
        recipePowerTitle.innerText = "Power";

        let recipePowerText = document.createElement("div");
        recipePowerText.classList.add("text");



        recipeMachineValue.appendChild(recipeMachineIcon);
        recipeMachineProp.appendChild(recipeMachineTitle);
        recipeMachineProp.appendChild(recipeMachineValue);

        recipeInputsProp.appendChild(recipeInputsTitle);

        recipeOutputsProp.appendChild(recipeOutputsTitle);

        recipePowerProp.appendChild(recipePowerTitle);
        recipePowerProp.appendChild(recipePowerText);

        recipeContainer.appendChild(recipeMachineProp);
        recipeContainer.appendChild(recipeInputsProp);
        recipeContainer.appendChild(recipeOutputsProp);
        recipeContainer.appendChild(recipePowerProp);

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



        recipeMachineIcon.src = `GameData/SatisfactoryIcons/${machine.iconPath}`;
        recipeMachineIcon.title = machine.displayName;
        recipeMachineIcon.alt = machine.displayName;

        recipe.ingredients.forEach(createResourceDisplay(recipeInputsProp, recipe.manufacturingDuration));

        recipe.products.forEach(createResourceDisplay(recipeOutputsProp, recipe.manufacturingDuration));

        recipePowerText.innerText = `${machine.powerConsumption} MW`;



        this.nodeSvgGroup.appendChild(this.nodeSvg);

        this.nodeSvgGroup.appendChild(foreignObject);

        parentGroup.appendChild(this.nodeSvgGroup);
    }

    public get position(): Point
    {
        let transform = this.nodeSvgGroup.getAttribute("transform") ?? "translate(0, 0)";
        let transformRegex = /translate\((?<x>-?\d+(?:\.\d+)?), ?(?<y>-?\d+(?:\.\d+)?)\)/;

        let match = transformRegex.exec(transform)!;
        let { x, y } = match.groups!;

        return { x: +x, y: +y };
    }

    public set position(position: Point)
    {
        this.nodeSvgGroup.setAttribute("transform", `translate(${position.x}, ${position.y})`);

        for (const group of this._inputSlotGroups)
        {
            group.dispatchEvent(new Event(SlotsGroup.boundsChangedEvent));
        }

        for (const group of this._outputSlotGroups)
        {
            group.dispatchEvent(new Event(SlotsGroup.boundsChangedEvent));
        }
    }

    private _inputSlotGroups: SlotsGroup[] = [];
    private _outputSlotGroups: SlotsGroup[] = [];
}

export function toItemsInMinute(amount: number, consumingTime: number): number
{
    return (60 / consumingTime) * amount;
}
