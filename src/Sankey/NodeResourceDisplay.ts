import { GameRecipe } from "../GameData/GameRecipe";
import { Rectangle } from "../Geometry/Rectangle";
import { SvgFactory } from "../SVG/SvgFactory";
import { loadSatisfactoryResource, overclockPower, satisfactoryIconPath, toItemsInMinute } from '../GameData/GameData';
import { GameMachine } from '../GameData/GameMachine';
import { SankeyNode } from './SankeyNode';

export class NodeResourceDisplay
{
    public constructor(associatedNode: SankeyNode, recipe: GameRecipe, machine: GameMachine)
    {
        this._recipe = recipe;
        this._machine = machine;

        this._displayContainer = SvgFactory.createSvgForeignObject();
        let recipeContainer = this.createHtmlElement("div", "recipe-container") as HTMLDivElement;

        this.createMachineDisplay(recipeContainer, machine);
        this.createOverclockDisplay(recipeContainer);
        this.createInputsDisplay(recipeContainer, recipe);
        this.createOutputsDisplay(recipeContainer, recipe);
        this.createPowerDisplay(recipeContainer, machine.powerConsumption);

        this._displayContainer.appendChild(recipeContainer);

        associatedNode.addEventListener(SankeyNode.resourcesAmountChangedEvent, () =>
        {
            this.updateDisplays(associatedNode);
        });
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
        let machineDisplay = this.createHtmlElement("div", "property") as HTMLDivElement;

        let title = this.createHtmlElement("div", "title");
        title.innerText = "Machines";

        machineDisplay.appendChild(title);

        this._machinesAmountDisplay = this.createAmountDisplay(
            machineDisplay,
            machine.displayName,
            1,
            machine.iconPath
        );

        parent.appendChild(machineDisplay);
    }

    private createInputsDisplay(parent: HTMLDivElement, recipe: GameRecipe)
    {
        let inputsDisplay = this.createHtmlElement("div", "property") as HTMLDivElement;

        let title = this.createHtmlElement("div", "title");
        title.innerText = "Input/min";

        inputsDisplay.appendChild(title);

        recipe.ingredients.forEach(resource =>
        {
            this._inputDisplays.push({
                htmlElement: this.createResourceDisplay(inputsDisplay, resource),
                initialAmount: resource.amount
            });
        });

        parent.appendChild(inputsDisplay);
    }

    private createOutputsDisplay(parent: HTMLDivElement, recipe: GameRecipe)
    {
        let outputsDisplay = this.createHtmlElement("div", "property") as HTMLDivElement;

        let title = this.createHtmlElement("div", "title");
        title.innerText = "Output/min";

        outputsDisplay.appendChild(title);

        recipe.products.forEach(resource =>
        {
            this._outputDisplays.push({
                htmlElement: this.createResourceDisplay(outputsDisplay, resource),
                initialAmount: resource.amount
            });
        });

        parent.appendChild(outputsDisplay);
    }

    private createPowerDisplay(parent: HTMLDivElement, powerConsumption: number)
    {
        let powerDisplay = this.createHtmlElement("div", "property");

        let title = this.createHtmlElement("div", "title");
        title.innerText = "Power";

        this._powerDisplay = this.createHtmlElement("div", "text") as HTMLDivElement;
        this._powerDisplay.innerText = `${powerConsumption} MW`;

        powerDisplay.appendChild(title);
        powerDisplay.appendChild(this._powerDisplay);

        parent.appendChild(powerDisplay);
    }

    private createOverclockDisplay(parent: HTMLDivElement)
    {
        let overclockDisplay = this.createHtmlElement("div", "property");

        let title = this.createHtmlElement("div", "title");
        title.innerText = "Overclock";

        this._overclockDisplay = this.createHtmlElement("div", "text") as HTMLDivElement;
        this._overclockDisplay.innerText = `100%`;

        overclockDisplay.appendChild(title);
        overclockDisplay.appendChild(this._overclockDisplay);

        parent.appendChild(overclockDisplay);
    }

    private createResourceDisplay(parentDiv: HTMLDivElement, recipeResource: RecipeResource)
    {
        let resource = loadSatisfactoryResource(recipeResource.id);

        let amountInMinute = +this.toItemsInMinute(recipeResource.amount).toFixed(4);

        return this.createAmountDisplay(parentDiv, resource.displayName, amountInMinute, resource.iconPath);
    }

    private createAmountDisplay(parentDiv: HTMLDivElement, name: string, amount: number, iconPath: string)
    {
        let resourceDiv = document.createElement("div");
        resourceDiv.classList.add("resource");

        let icon = this.createHtmlElement("img", "icon") as HTMLImageElement;
        icon.loading = "lazy";
        icon.src = satisfactoryIconPath(iconPath);
        icon.title = name;
        icon.alt = name;

        let amountText = this.createHtmlElement("p", "amount") as HTMLParagraphElement;
        amountText.classList.add("amount");
        amountText.innerText = `${amount}`;

        resourceDiv.appendChild(icon);
        resourceDiv.appendChild(amountText);
        parentDiv.appendChild(resourceDiv);

        return amountText;
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

    private updateDisplays(associatedNode: SankeyNode): void
    {
        let toFixed = (value: number) => +value.toFixed(2);

        this._machinesAmountDisplay.innerText = `${toFixed(associatedNode.machinesAmount)}`;
        this._overclockDisplay.innerText = `${toFixed(associatedNode.overclockRatio * 100)}%`;

        for (const inputDisplay of this._inputDisplays)
        {
            let amount = inputDisplay.initialAmount
                * associatedNode.overclockRatio
                * associatedNode.machinesAmount;

            inputDisplay.htmlElement.innerText = `${toFixed(this.toItemsInMinute(amount))}`;
        }

        for (const outputDisplay of this._outputDisplays)
        {
            let amount = outputDisplay.initialAmount
                * associatedNode.overclockRatio
                * associatedNode.machinesAmount;

            outputDisplay.htmlElement.innerText = `${toFixed(this.toItemsInMinute(amount))}`;
        }

        let overclockedPower = overclockPower(
            this._machine.powerConsumption,
            associatedNode.overclockRatio,
            this._machine.powerConsumptionExponent
        );

        this._powerDisplay.innerText = `${toFixed(overclockedPower * associatedNode.machinesAmount)} MW`;
    }

    private readonly _recipe: GameRecipe;
    private readonly _machine: GameMachine;

    private readonly _displayContainer: SVGForeignObjectElement;

    private _machinesAmountDisplay!: HTMLParagraphElement;
    private _overclockDisplay!: HTMLParagraphElement;
    private _inputDisplays: { htmlElement: HTMLParagraphElement; initialAmount: number; }[] = [];
    private _outputDisplays: { htmlElement: HTMLParagraphElement; initialAmount: number; }[] = [];
    private _powerDisplay!: HTMLParagraphElement;
}