// Ignore import error as the file only appears on launch of the exporting tool.
// @ts-ignore
import satisfactoryData from '../../dist/GameData/Satisfactory.json';

import { GameRecipe } from "../GameData/GameRecipe";
import { Rectangle } from "../Rectangle";
import { SvgFactory } from "../SVG/SvgFactory";
import { satisfactoryIconPath, toItemsInMinute } from '../GameData/GameData';
import { GameMachine } from '../GameData/GameMachine';

export class NodeResourceDisplay
{
    constructor(recipe: GameRecipe, machine: GameMachine)
    {
        this._recipe = recipe;

        this._displayContainer = SvgFactory.createSvgForeignObject();
        let recipeContainer = this.createHtmlElement("div", "recipe-container") as HTMLDivElement;

        this.createMachineDisplay(recipeContainer, machine);
        this.createInputsDisplay(recipeContainer, recipe);
        this.createOutputsDisplay(recipeContainer, recipe);
        this.createPowerDisplay(recipeContainer, machine.powerConsumption);

        this._displayContainer.appendChild(recipeContainer);
    }

    public setBounds(bounds: Rectangle)
    {
        this._displayContainer.setAttribute("x", `${bounds.x}`);
        this._displayContainer.setAttribute("y", `${bounds.y}`);
        this._displayContainer.setAttribute("width", `${bounds.width}`);
        this._displayContainer.setAttribute("height", `${bounds.height}`);
    }

    public appendTo(element: SVGElement)
    {
        element.appendChild(this._displayContainer);
    }

    private createMachineDisplay(parent: HTMLDivElement, machine: GameMachine)
    {
        let machineDisplay = this.createHtmlElement("div", "property");

        let title = this.createHtmlElement("div", "title");
        let value = this.createHtmlElement("div", "machine");
        let machineIcon = this.createHtmlElement("img", "icon") as HTMLImageElement;

        title.innerText = "Machine";
        machineIcon.src = satisfactoryIconPath(machine.iconPath);
        machineIcon.title = machine.displayName;
        machineIcon.alt = machine.displayName;

        value.appendChild(machineIcon);
        machineDisplay.appendChild(title);
        machineDisplay.appendChild(value);

        parent.appendChild(machineDisplay);
    }

    private createInputsDisplay(parent: HTMLDivElement, recipe: GameRecipe)
    {
        let inputsDisplay = this.createHtmlElement("div", "property") as HTMLDivElement;

        let title = this.createHtmlElement("div", "title");
        title.innerText = "Input/min";

        inputsDisplay.appendChild(title);

        recipe.ingredients.forEach(this.createResourceDisplay(inputsDisplay));

        parent.appendChild(inputsDisplay);
    }

    private createOutputsDisplay(parent: HTMLDivElement, recipe: GameRecipe)
    {
        let outputsDisplay = this.createHtmlElement("div", "property") as HTMLDivElement;

        let title = this.createHtmlElement("div", "title");
        title.innerText = "Output/min";

        outputsDisplay.appendChild(title);

        recipe.products.forEach(this.createResourceDisplay(outputsDisplay));

        parent.appendChild(outputsDisplay);
    }

    private createPowerDisplay(parent: HTMLDivElement, powerConsumption: number)
    {
        let powerDisplay = this.createHtmlElement("div", "property");

        let title = this.createHtmlElement("div", "title");
        let text = this.createHtmlElement("div", "text") as HTMLDivElement;
        title.innerText = "Power";

        powerDisplay.appendChild(title);
        powerDisplay.appendChild(text);

        text.innerText = `${powerConsumption} MW`;

        parent.appendChild(powerDisplay);
    }

    private createResourceDisplay(parentDiv: HTMLDivElement)
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
            amount.innerText = `${+this.toItemsInMinute(recipeResource.amount).toPrecision(3)}`;

            resourceDiv.appendChild(icon);
            resourceDiv.appendChild(amount);
            parentDiv.appendChild(resourceDiv);
        };
    }

    private toItemsInMinute(amount: number)
    {
        return toItemsInMinute(amount, this._recipe.manufacturingDuration);
    }

    private createHtmlElement(tag: string, ...classes: string[])
    {
        let element = document.createElement(tag);
        element.classList.add(...classes);
        return element;
    }

    private readonly _recipe: GameRecipe;

    private readonly _displayContainer: SVGForeignObjectElement;
}
