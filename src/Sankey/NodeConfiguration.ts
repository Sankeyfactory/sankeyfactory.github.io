// Ignore import error as the file only appears on launch of the exporting tool.
// @ts-ignore
import satisfactoryData from '../../dist/GameData/Satisfactory.json';

import { GameMachine } from "../GameData/GameMachine";
import { GameRecipe } from "../GameData/GameRecipe";
import { satisfactoryIconPath, toItemsInMinute } from "../GameData/GameData";
import { SvgFactory } from '../SVG/SvgFactory';

export class NodeConfiguration extends EventTarget
{
    public constructor(recipe: GameRecipe, machine: GameMachine)
    {
        super();

        let closeSelector = `#${NodeConfiguration._modalContainer.id} .title-row .close`;
        let closeButton = document.querySelector(closeSelector) as HTMLDivElement;

        closeButton.addEventListener("click", () =>
        {
            this.closeConfigurationWindow();
        });

        window.addEventListener("keydown", (event) =>
        {
            if (event.code === "Escape" && this._isOpened)
            {
                this.closeConfigurationWindow();
            }
        });

        this.setupTableElements(recipe, machine);
    }

    public openConfigurationWindow(): void
    {
        // Machines amount group

        NodeConfiguration._machinesColumn.appendChild(this._machineConfigurator!.htmlElement);

        for (const configurator of this._amountConfigurators.inputsConfigurators)
        {
            NodeConfiguration._amountInputsColumn.appendChild(configurator.htmlElement);
        }
        for (const configurator of this._amountConfigurators.outputsConfigurators)
        {
            NodeConfiguration._amountOutputsColumn.appendChild(configurator.htmlElement);
        }

        NodeConfiguration._amountPowerColumn.appendChild(
            this._amountConfigurators.powerConfigurator!.htmlElement
        );

        // Overclock group

        NodeConfiguration._multipliersColumn.appendChild(this._overclockConfigurator!.htmlElement);

        for (const configurator of this._overclockConfigurators.inputsConfigurators)
        {
            NodeConfiguration._overclockInputsColumn.appendChild(configurator.htmlElement);
        }
        for (const configurator of this._overclockConfigurators.outputsConfigurators)
        {
            NodeConfiguration._overclockOutputsColumn.appendChild(configurator.htmlElement);
        }

        NodeConfiguration._overclockPowerColumn.appendChild(
            this._overclockConfigurators.powerConfigurator!.htmlElement
        );

        // Modal window

        NodeConfiguration._modalContainer.classList.remove("hidden");
        this._isOpened = true;
    }

    private closeConfigurationWindow(): void
    {
        this._machineConfigurator!.htmlElement.remove();
        this._overclockConfigurator!.htmlElement.remove();
        this._amountConfigurators.removeFromDom();
        this._overclockConfigurators.removeFromDom();

        NodeConfiguration._modalContainer.classList.add("hidden");
        this._isOpened = false;
    }

    private setupTableElements(recipe: GameRecipe, machine: GameMachine)
    {
        let machineIcon = NodeConfiguration.createImgIcon(machine.displayName, machine.iconPath);

        this._machineConfigurator =
            NodeConfiguration.generateConfigurator(machineIcon, 1, "");

        let overclockIcon = NodeConfiguration.createImgIcon(
            "Overclock",
            "Resource/Environment/Crystal/PowerShard.png"
        );

        this._overclockConfigurator =
            NodeConfiguration.generateConfigurator(overclockIcon, 100, "%");

        let createResourceConfigurators = function (
            resource: RecipeResource,
            amountConfigurators: Configurator[],
            overclockConfigurators: Configurator[]
        ): void
        {
            let resourceDesc = satisfactoryData.resources.find(
                // I specify type because deploy fails otherwise for some reason.
                (resourceData: typeof satisfactoryData.resources[0]) => 
                {
                    return resourceData.id == resource.id;
                }
            )!;

            let resourceIcon1 = NodeConfiguration.createImgIcon(resourceDesc.displayName, resourceDesc.iconPath);
            let resourceIcon2 = NodeConfiguration.createImgIcon(resourceDesc.displayName, resourceDesc.iconPath);

            let itemsInMinute = toItemsInMinute(resource.amount, recipe.manufacturingDuration);

            amountConfigurators.push(
                NodeConfiguration.generateConfigurator(resourceIcon1, itemsInMinute, "/min")
            );

            overclockConfigurators.push(
                NodeConfiguration.generateConfigurator(resourceIcon2, itemsInMinute, "/min")
            );
        };

        recipe.ingredients.forEach(resource => createResourceConfigurators(
            resource,
            this._amountConfigurators.inputsConfigurators,
            this._overclockConfigurators.inputsConfigurators
        ));

        recipe.products.forEach(resource => createResourceConfigurators(
            resource,
            this._amountConfigurators.outputsConfigurators,
            this._overclockConfigurators.outputsConfigurators
        ));

        let powerIcon1 = NodeConfiguration.createPowerSvgIcon();
        let powerIcon2 = NodeConfiguration.createPowerSvgIcon();

        this._amountConfigurators.powerConfigurator =
            NodeConfiguration.generateConfigurator(powerIcon1, machine.powerConsumption, "MW");

        this._overclockConfigurators.powerConfigurator =
            NodeConfiguration.generateConfigurator(powerIcon2, machine.powerConsumption, "MW");
    }

    private static generateConfigurator(
        icon: HTMLImageElement | SVGElement,
        initialValue: number,
        units: string
    ): Configurator
    {
        let editElement = document.createElement("div");
        editElement.classList.add("edit");

        let iconContainer = document.createElement("div");
        iconContainer.classList.add("icon-container");

        iconContainer.appendChild(icon);

        let inputElement = document.createElement("input");
        inputElement.value = `${initialValue}`;

        let unitsElement = document.createElement("div");
        unitsElement.classList.add("units");
        unitsElement.innerText = units;

        editElement.appendChild(iconContainer);
        editElement.appendChild(inputElement);
        editElement.appendChild(unitsElement);

        return new Configurator(editElement, initialValue);
    }

    private static createImgIcon(name: string, iconPath: string): HTMLImageElement
    {
        let icon = document.createElement("img");

        icon.src = satisfactoryIconPath(iconPath);
        icon.alt = name;
        icon.title = name;

        return icon;
    }

    private static createPowerSvgIcon(): SVGElement
    {
        let icon = SvgFactory.createSvgElement("svg");
        icon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        icon.setAttribute("viewBox", "0 -960 960 960");

        let path = SvgFactory.createSvgPath();
        path.setAttribute("d", "M420-412H302q-14 0-20-12t2-23l203-295q5-7 12-9t15 1q8 3 11.5 9.5T528-726l-27 218h140q14 0 20 13t-3 24L431-199q-5 6-12 7.5t-14-1.5q-7-3-10.5-9t-2.5-14l28-196Z");

        icon.appendChild(path);

        return icon;
    }

    private _isOpened = false;

    private _machineConfigurator?: Configurator;
    private _overclockConfigurator?: Configurator;
    private _amountConfigurators = new Configurators();
    private _overclockConfigurators = new Configurators();

    private static _modalContainer =
        document.querySelector("#machine-configuration-container") as HTMLDivElement;

    private static _machinesColumn = document.querySelector(
        `#${NodeConfiguration._modalContainer.id} .table.amount>.column.machines`
    ) as HTMLDivElement;
    private static _amountInputsColumn = document.querySelector(
        `#${NodeConfiguration._modalContainer.id} .table.amount>.column.inputs`
    ) as HTMLDivElement;
    private static _amountOutputsColumn = document.querySelector(
        `#${NodeConfiguration._modalContainer.id} .table.amount>.column.outputs`
    ) as HTMLDivElement;
    private static _amountPowerColumn = document.querySelector(
        `#${NodeConfiguration._modalContainer.id} .table.amount>.column.power`
    ) as HTMLDivElement;

    private static _multipliersColumn = document.querySelector(
        `#${NodeConfiguration._modalContainer.id} .table.overclock>.column.multipliers`
    ) as HTMLDivElement;
    private static _overclockInputsColumn = document.querySelector(
        `#${NodeConfiguration._modalContainer.id} .table.overclock>.column.inputs`
    ) as HTMLDivElement;
    private static _overclockOutputsColumn = document.querySelector(
        `#${NodeConfiguration._modalContainer.id} .table.overclock>.column.outputs`
    ) as HTMLDivElement;
    private static _overclockPowerColumn = document.querySelector(
        `#${NodeConfiguration._modalContainer.id} .table.overclock>.column.power`
    ) as HTMLDivElement;
}

class Configurators
{
    inputsConfigurators = new Array<Configurator>;
    outputsConfigurators = new Array<Configurator>;
    powerConfigurator?: Configurator;

    removeFromDom(): void
    {
        for (const configurator of this.inputsConfigurators)
        {
            configurator.htmlElement.remove();
        }

        for (const configurator of this.outputsConfigurators)
        {
            configurator.htmlElement.remove();
        }

        if (this.powerConfigurator != undefined)
        {
            this.powerConfigurator.htmlElement.remove();
        }
    }
};

class Configurator
{
    constructor(
        public htmlElement: HTMLDivElement,
        public initialValue: number)
    { };
}
