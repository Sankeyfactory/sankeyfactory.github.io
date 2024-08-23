// Ignore import error as the file only appears on launch of the exporting tool.
// @ts-ignore
import satisfactoryData from '../../../dist/GameData/Satisfactory.json';

import { toItemsInMinute } from '../../GameData/GameData';
import { GameMachine } from "../../GameData/GameMachine";
import { GameRecipe } from "../../GameData/GameRecipe";
import { Configurators } from './Configurator';
import { ConfiguratorBuilder } from './ConfiguratorBuilder';

export class NodeConfiguration extends EventTarget
{
    public static readonly machinesAmountChangedEvent = "machines-amount-changed";
    public static readonly overclockChangedEvent = "overclock-changed";

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

        NodeConfiguration._machinesColumn.appendChild(this._machineConfigurator!);

        for (const configurator of this._amountConfigurators.inputsConfigurators)
        {
            NodeConfiguration._amountInputsColumn.appendChild(configurator);
        }
        for (const configurator of this._amountConfigurators.outputsConfigurators)
        {
            NodeConfiguration._amountOutputsColumn.appendChild(configurator);
        }

        NodeConfiguration._amountPowerColumn.appendChild(
            this._amountConfigurators.powerConfigurator!
        );

        // Overclock group

        NodeConfiguration._multipliersColumn.appendChild(this._overclockConfigurator!);

        for (const configurator of this._overclockConfigurators.inputsConfigurators)
        {
            NodeConfiguration._overclockInputsColumn.appendChild(configurator);
        }
        for (const configurator of this._overclockConfigurators.outputsConfigurators)
        {
            NodeConfiguration._overclockOutputsColumn.appendChild(configurator);
        }

        NodeConfiguration._overclockPowerColumn.appendChild(
            this._overclockConfigurators.powerConfigurator!
        );

        // Modal window

        NodeConfiguration._modalContainer.classList.remove("hidden");
        this._isOpened = true;
    }

    private closeConfigurationWindow(): void
    {
        this._machineConfigurator!.remove();
        this._overclockConfigurator!.remove();
        this._amountConfigurators.removeFromDom();
        this._overclockConfigurators.removeFromDom();

        NodeConfiguration._modalContainer.classList.add("hidden");
        this._isOpened = false;
    }

    private setupTableElements(recipe: GameRecipe, machine: GameMachine)
    {
        let minOverclockRatio = NodeConfiguration.minOverclockRatio;
        let maxOverclockRatio = NodeConfiguration.maxOverclockRatio;

        this._machineConfigurator = new ConfiguratorBuilder(this)
            .setIconImage(machine.displayName, machine.iconPath)
            .setInitialValue(1)
            .setUnits("")
            .setMinimum(() => 0.0001)
            .setMaximum(() => undefined)
            .setRelatedProperty(
                () => this.machinesAmount,
                (value) => this.machinesAmount = value
            )
            .subscribeToMachinesAmount()
            .build();

        this._overclockConfigurator = new ConfiguratorBuilder(this)
            .setIconImage("Overclock", "Resource/Environment/Crystal/PowerShard.png")
            .setInitialValue(100)
            .setUnits("%")
            .setMinimum(() => minOverclockRatio * 100)
            .setMaximum(() => maxOverclockRatio * 100)
            .setRelatedProperty(
                () => this.overclockRatio * 100,
                (value) => this.overclockRatio = value / 100
            )
            .subscribeToOverclock()
            .build();

        let createResourceConfigurators = (
            resource: RecipeResource,
            amountConfigurators: HTMLDivElement[],
            overclockConfigurators: HTMLDivElement[]
        ): void =>
        {
            let resourceDesc = satisfactoryData.resources.find(
                // I specify type because deploy fails otherwise for some reason.
                (resourceData: typeof satisfactoryData.resources[0]) => 
                {
                    return resourceData.id == resource.id;
                }
            );

            if (resourceDesc == undefined)
            {
                throw Error(`Couldn't find resource descriptor for "${resource.id}"`);
            }

            let itemsInMinute = toItemsInMinute(resource.amount, recipe.manufacturingDuration);

            let amountConfigurator = new ConfiguratorBuilder(this)
                .setIconImage(resourceDesc.displayName, resourceDesc.iconPath)
                .setInitialValue(itemsInMinute)
                .setUnits("/min")
                .setMinimum(() => 0.0001)
                .setMaximum(() => undefined)
                .setRelatedProperty(
                    () => itemsInMinute * this.overclockRatio * this.machinesAmount,
                    (value) => this.machinesAmount = value / itemsInMinute / this.overclockRatio
                )
                .subscribeToMachinesAmount()
                .subscribeToOverclock()
                .build();

            let overclockConfigurator = new ConfiguratorBuilder(this)
                .setIconImage(resourceDesc.displayName, resourceDesc.iconPath)
                .setInitialValue(itemsInMinute)
                .setUnits("/min")
                .setMinimum(() => itemsInMinute * minOverclockRatio)
                .setMaximum(() => itemsInMinute * maxOverclockRatio)
                .setRelatedProperty(
                    () => itemsInMinute * this.overclockRatio,
                    (value) => this.overclockRatio = value / itemsInMinute
                )
                .subscribeToOverclock()
                .build();

            amountConfigurators.push(amountConfigurator);
            overclockConfigurators.push(overclockConfigurator);
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

        let overclockedPower = (power: number, overclockRatio: number) =>
        {
            return power * Math.pow(overclockRatio, machine.powerConsumptionExponent);
        };

        let overclockFromPower = (power: number) =>
        {
            return Math.pow(power / machine.powerConsumption, 1 / machine.powerConsumptionExponent);
        };

        let getInitialOverclockedPower = () =>
        {
            return overclockedPower(machine.powerConsumption, this.overclockRatio);
        };

        this._amountConfigurators.powerConfigurator = new ConfiguratorBuilder(this)
            .setPowerSvgIcon()
            .setInitialValue(machine.powerConsumption)
            .setUnits("MW")
            .setMinimum(() => 0.0001)
            .setMaximum(() => undefined)
            .setRelatedProperty(
                () => getInitialOverclockedPower() * this.machinesAmount,
                (value) => this.machinesAmount = value / getInitialOverclockedPower()
            )
            .subscribeToMachinesAmount()
            .subscribeToOverclock()
            .build();

        this._overclockConfigurators.powerConfigurator = new ConfiguratorBuilder(this)
            .setPowerSvgIcon()
            .setInitialValue(machine.powerConsumption)
            .setUnits("MW")
            .setMinimum(() => overclockedPower(machine.powerConsumption, minOverclockRatio))
            .setMaximum(() => overclockedPower(machine.powerConsumption, maxOverclockRatio))
            .setRelatedProperty(
                () => overclockedPower(machine.powerConsumption, this.overclockRatio),
                (value) => this.overclockRatio = overclockFromPower(value)
            )
            .subscribeToOverclock()
            .build();
    }

    private get machinesAmount(): number
    {
        return this._machinesAmount;
    }

    private set machinesAmount(value: number)
    {
        if (value !== this._machinesAmount)
        {
            this._machinesAmount = value;
            this.dispatchEvent(new Event(NodeConfiguration.machinesAmountChangedEvent));
        }
    }

    private get overclockRatio(): number
    {
        return this._overclockRatio;
    }

    private set overclockRatio(value: number)
    {
        if (value !== this._overclockRatio)
        {
            let min = NodeConfiguration.minOverclockRatio;
            let max = NodeConfiguration.maxOverclockRatio;

            value = Math.min(max, Math.max(min, value));
            this._overclockRatio = value;

            this.dispatchEvent(new Event(NodeConfiguration.overclockChangedEvent));
        }
    }

    private static getColumn(group: string, column: string): HTMLDivElement
    {
        return document.querySelector(
            `#${NodeConfiguration._modalContainer.id} .table.${group}>.column.${column}`
        ) as HTMLDivElement;
    }

    private _isOpened = false;

    private _machinesAmount = 1;
    private _overclockRatio = 1;

    private _machineConfigurator?: HTMLDivElement;
    private _overclockConfigurator?: HTMLDivElement;
    private _amountConfigurators = new Configurators();
    private _overclockConfigurators = new Configurators();

    private static minOverclockRatio = 0.01;
    private static maxOverclockRatio = 2.50;

    private static _modalContainer =
        document.querySelector("#machine-configuration-container") as HTMLDivElement;

    private static _machinesColumn = NodeConfiguration.getColumn("amount", "machines");
    private static _amountInputsColumn = NodeConfiguration.getColumn("amount", "inputs");
    private static _amountOutputsColumn = NodeConfiguration.getColumn("amount", "outputs");
    private static _amountPowerColumn = NodeConfiguration.getColumn("amount", "power");

    private static _multipliersColumn = NodeConfiguration.getColumn("overclock", "multipliers");
    private static _overclockInputsColumn = NodeConfiguration.getColumn("overclock", "inputs");
    private static _overclockOutputsColumn = NodeConfiguration.getColumn("overclock", "outputs");
    private static _overclockPowerColumn = NodeConfiguration.getColumn("overclock", "power");
}


