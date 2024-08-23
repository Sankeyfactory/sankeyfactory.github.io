// Ignore import error as the file only appears on launch of the exporting tool.
// @ts-ignore
import satisfactoryData from '../../dist/GameData/Satisfactory.json';

import { Point } from "../Point";
import { SankeySlot } from "./Slots/SankeySlot";
import { SlotsGroup, SlotsGroupType } from "./SlotsGroup";
import { SvgFactory } from "../SVG/SvgFactory";
import { GameRecipe } from "../GameData/GameRecipe";
import { GameMachine } from "../GameData/GameMachine";
import { NodeContextMenu } from '../ContextMenu/NodeContextMenu';
import { NodeConfiguration } from './NodeConfiguration/NodeConfiguration';
import { satisfactoryIconPath, toItemsInMinute } from '../GameData/GameData';

export class SankeyNode
{
    public nodeSvg: SVGElement;
    public nodeSvgGroup: SVGGElement;
    public static readonly nodeWidth = 60;

    constructor(
        parentGroup: SVGGElement,
        position: Point,
        recipe: GameRecipe,
        machine: GameMachine,
    )
    {
        this._recipe = { ...recipe };
        this._height = SankeyNode._nodeHeight;


        let sumResources = (sum: number, product: RecipeResource) =>
            sum + this.toItemsInMinute(product.amount);

        this._inputResourcesAmount = this._recipe.ingredients.reduce(sumResources, 0);
        this._outputResourcesAmount = this._recipe.products.reduce(sumResources, 0);


        this.nodeSvgGroup = SvgFactory.createSvgGroup({
            x: position.x - SankeyNode.nodeWidth / 2 - SankeySlot.slotWidth,
            y: position.y - this.height / 2
        }, "node", "animate-appearance");

        this.nodeSvg = SvgFactory.createSvgRect({
            width: SankeyNode.nodeWidth,
            height: this.height,
            x: SankeySlot.slotWidth,
            y: 0
        }, "machine");


        this._inputSlotGroups = this.createGroups("input", recipe.ingredients);
        this._outputSlotGroups = this.createGroups("output", recipe.products);


        this.configureContextMenu(recipe, machine);



        let foreignObject = SvgFactory.createSvgForeignObject();

        foreignObject.setAttribute("x", "10");
        foreignObject.setAttribute("y", "0");
        foreignObject.setAttribute("width", `${SankeyNode.nodeWidth}`);
        foreignObject.setAttribute("height", `${this.height}`);


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



        let createResourceDisplay = function (parentDiv: HTMLDivElement, craftingTime: number) 
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
                icon.src = satisfactoryIconPath(resource!.iconPath);
                icon.title = resource!.displayName;

                let amount = document.createElement("p");
                amount.classList.add("amount");
                amount.innerText = `${+((60 / craftingTime) * recipeResource.amount).toPrecision(3)}`;

                resourceDiv.appendChild(icon);
                resourceDiv.appendChild(amount);
                parentDiv.appendChild(resourceDiv);
            };
        };



        recipeMachineIcon.src = satisfactoryIconPath(machine.iconPath);
        recipeMachineIcon.title = machine.displayName;
        recipeMachineIcon.alt = machine.displayName;

        recipe.ingredients.forEach(createResourceDisplay(recipeInputsProp, recipe.manufacturingDuration));

        recipe.products.forEach(createResourceDisplay(recipeOutputsProp, recipe.manufacturingDuration));

        recipePowerText.innerText = `${machine.powerConsumption} MW`;



        this.nodeSvgGroup.appendChild(this.nodeSvg);

        this.nodeSvgGroup.appendChild(foreignObject);

        parentGroup.appendChild(this.nodeSvgGroup);
    }

    public delete()
    {
        for (const slotsGroup of this._inputSlotGroups)
        {
            slotsGroup.delete();
        }

        for (const slotsGroup of this._outputSlotGroups)
        {
            slotsGroup.delete();
        }

        this.nodeSvgGroup.remove();
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

    public get height(): number
    {
        return this._height;
    }

    public get inputResourcesAmount(): number
    {
        return this._inputResourcesAmount;
    }

    private set inputResourcesAmount(inputResourcesAmount: number)
    {
        this._inputResourcesAmount = inputResourcesAmount;
    }

    public get outputResourcesAmount(): number
    {
        return this._outputResourcesAmount;
    }

    private set outputResourcesAmount(outputResourcesAmount: number)
    {
        this._outputResourcesAmount = outputResourcesAmount;
    }

    private configureContextMenu(recipe: GameRecipe, machine: GameMachine): void
    {
        let nodeContextMenu = new NodeContextMenu(this.nodeSvg);

        nodeContextMenu.addEventListener(NodeContextMenu.deleteNodeOptionClickedEvent, () =>
        {
            this.delete();
        });

        let configurator = new NodeConfiguration(recipe, machine);

        let openConfigurator = (event: Event) =>
        {
            configurator.openConfigurationWindow(this.machinesAmount, this.overclockRatio);
            event.stopPropagation();
        };

        nodeContextMenu.addEventListener(NodeContextMenu.configureNodeOptionClickedEvent, openConfigurator);
        this.nodeSvg.addEventListener("dblclick", openConfigurator);

        configurator.addEventListener(NodeConfiguration.configurationUpdatedEvent, () =>
        {
            this.machinesAmount = configurator.machinesAmount;
            this.overclockRatio = configurator.overclockRatio;
        });
    }

    private createGroups(type: SlotsGroupType, resources: RecipeResource[]): SlotsGroup[]
    {
        let result: SlotsGroup[] = [];
        let nextGroupY = 0;

        for (const resource of resources)
        {
            let newGroup = new SlotsGroup(
                this,
                type,
                { id: resource.id, amount: this.toItemsInMinute(resource.amount) },
                nextGroupY
            );

            result.push(newGroup);

            nextGroupY += newGroup.height;
        }

        return result;
    }

    private toItemsInMinute(amount: number)
    {
        return toItemsInMinute(amount, this._recipe.manufacturingDuration);
    }

    private get machinesAmount(): number
    {
        return this._machinesAmount;
    }

    private set machinesAmount(value: number)
    {
        let difference = value / this._machinesAmount;

        this._machinesAmount = value;

        this.inputResourcesAmount *= difference;
        this.outputResourcesAmount *= difference;
    }

    private get overclockRatio(): number
    {
        return this._overclockRatio;
    }

    private set overclockRatio(value: number)
    {
        let difference = value / this._overclockRatio;

        this._overclockRatio = value;

        this.inputResourcesAmount *= difference;
        this.outputResourcesAmount *= difference;
    }

    private _recipe: GameRecipe;

    private _inputResourcesAmount: number;
    private _outputResourcesAmount: number;

    private _machinesAmount = 1;
    private _overclockRatio = 1;

    private _height: number;

    private _inputSlotGroups: SlotsGroup[] = [];
    private _outputSlotGroups: SlotsGroup[] = [];

    private static readonly _nodeHeight = 260;
}
