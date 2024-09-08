import { loadSatisfactoryResource, overclockPower, toItemsInMinute } from '../../GameData/GameData';
import { GameMachine } from "../../GameData/GameMachine";
import { GameRecipe } from "../../GameData/GameRecipe";
import { Configurators } from './Configurator';
import { ConfiguratorBuilder } from './ConfiguratorBuilder';

export class NodeConfiguration extends EventTarget
{
    public static readonly machinesAmountChangedEvent = "machines-amount-changed";
    public static readonly overclockChangedEvent = "overclock-changed";

    public static readonly configurationUpdatedEvent = "configuration-updated";

    public constructor(recipe: GameRecipe, machine: GameMachine)
    {
        super();

        let closeSelector = `#${NodeConfiguration._modalContainer.id} .title-row .close`;
        let closeButton = document.querySelector(closeSelector) as HTMLDivElement;

        closeButton.addEventListener("click", (event) =>
        {
            if (this._isOpened)
            {
                event.stopPropagation();
                this.closeConfigurationWindow();
            }
        });

        window.addEventListener("keydown", (event) =>
        {
            if (this._isOpened && event.code === "Escape")
            {
                event.preventDefault();
                event.stopPropagation();
                this.closeConfigurationWindow();
            }

            if (event.key === "Enter")
            {
                event.preventDefault();
                event.stopPropagation();
                this.confirmConfiguration();
            }
        });

        this.setupTableElements(recipe, machine);

        this.addEventListener(NodeConfiguration.machinesAmountChangedEvent, () =>
        {
            this.updateResetButton();
            this.updateRestoreButton();
        });

        this.addEventListener(NodeConfiguration.overclockChangedEvent, () =>
        {
            this.updateResetButton();
            this.updateRestoreButton();
        });

        NodeConfiguration._restoreButton.addEventListener("click", () =>
        {
            if (this._isOpened)
            {
                this.machinesAmount = this._openingMachinesAmount;
                this.overclockRatio = this._openingOverclockRatio;
            }
        });

        NodeConfiguration._resetButton.addEventListener("click", () =>
        {
            if (this._isOpened)
            {
                this.machinesAmount = 1;
                this.overclockRatio = 1;
            }
        });

        NodeConfiguration._applyButton.addEventListener("click", () =>
        {
            if (this._isOpened)
            {
                this.confirmConfiguration();
            }
        });

        NodeConfiguration._modalContainer.querySelector(".modal-window")!.addEventListener("click", (event) =>
        {
            event.stopPropagation();
        });

        NodeConfiguration._modalContainer.addEventListener("click", (event) =>
        {
            event.stopPropagation();
            this.closeConfigurationWindow();
        });
    }

    public openConfigurationWindow(openingMachinesAmount: number, openingOverclockRatio: number): void
    {
        this._openingMachinesAmount = openingMachinesAmount;
        this._openingOverclockRatio = openingOverclockRatio;

        this.machinesAmount = this._openingMachinesAmount;
        this.overclockRatio = this._openingOverclockRatio;

        /* Machines amount group */

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

        if (this._amountConfigurators.outputsConfigurators.length === 0)
        {
            NodeConfiguration._amountOutputsColumn.classList.add("hidden");
        }
        else
        {
            NodeConfiguration._amountOutputsColumn.classList.remove("hidden");
        }

        /* Overclock group */

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

        if (this._overclockConfigurators.outputsConfigurators.length === 0)
        {
            NodeConfiguration._overclockOutputsColumn.classList.add("hidden");
        }
        else
        {
            NodeConfiguration._overclockOutputsColumn.classList.remove("hidden");
        }

        /* Modal window */

        NodeConfiguration._modalContainer.classList.remove("hidden");

        this._isOpened = true;

        this.updateResetButton();
        this.updateRestoreButton();
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

    private confirmConfiguration(): void
    {
        this.dispatchEvent(new Event(NodeConfiguration.configurationUpdatedEvent));

        this.closeConfigurationWindow();
    }

    private setupTableElements(recipe: GameRecipe, machine: GameMachine)
    {
        let minOverclockRatio = NodeConfiguration._minOverclockRatio;
        let maxOverclockRatio = NodeConfiguration._maxOverclockRatio;

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
            let resourceDesc = loadSatisfactoryResource(resource.id);

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
            return overclockPower(power, overclockRatio, machine.powerConsumptionExponent);
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

    private updateRestoreButton() 
    {
        if (this._isOpened)
        {
            if (this.machinesAmount !== this._openingMachinesAmount
                || this.overclockRatio !== this._openingOverclockRatio)
            {
                NodeConfiguration._restoreButton.classList.remove("disabled");
            }
            else
            {
                NodeConfiguration._restoreButton.classList.add("disabled");
            }
        }
    }

    private updateResetButton() 
    {
        if (this._isOpened)
        {
            if (this.machinesAmount !== 1 || this.overclockRatio !== 1)
            {
                NodeConfiguration._resetButton.classList.remove("disabled");
            }
            else
            {
                NodeConfiguration._resetButton.classList.add("disabled");
            }
        }
    }

    public get machinesAmount(): number
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

    public get overclockRatio(): number
    {
        return this._overclockRatio;
    }

    private set overclockRatio(value: number)
    {
        if (value !== this._overclockRatio)
        {
            let min = NodeConfiguration._minOverclockRatio;
            let max = NodeConfiguration._maxOverclockRatio;

            value = Math.min(max, Math.max(min, value));
            this._overclockRatio = value;

            this.dispatchEvent(new Event(NodeConfiguration.overclockChangedEvent));
        }
    }

    private static queryModalSuccessor(query: string): Element
    {
        let fullQuery = `#${NodeConfiguration._modalContainer.id} ${query}`;
        let element = document.querySelector(fullQuery);

        if (element == null)
        {
            throw Error(`Couldn't find required element: ${fullQuery}`);
        }

        return element;
    }

    private static getColumn(group: string, column: string): HTMLDivElement
    {
        let query = `.table.${group}>.column.${column}`;
        return NodeConfiguration.queryModalSuccessor(query) as HTMLDivElement;
    }

    private _isOpened = false;

    private _machinesAmount = 1;
    private _overclockRatio = 1;

    private _openingMachinesAmount = this._machinesAmount;
    private _openingOverclockRatio = this._overclockRatio;

    private _machineConfigurator?: HTMLDivElement;
    private _overclockConfigurator?: HTMLDivElement;
    private _amountConfigurators = new Configurators();
    private _overclockConfigurators = new Configurators();

    private static readonly _minOverclockRatio = 0.01;
    private static readonly _maxOverclockRatio = 2.50;

    private static readonly _modalContainer =
        document.querySelector("#machine-configuration-container") as HTMLDivElement;

    private static readonly _machinesColumn = NodeConfiguration.getColumn("amount", "machines");
    private static readonly _amountInputsColumn = NodeConfiguration.getColumn("amount", "inputs");
    private static readonly _amountOutputsColumn = NodeConfiguration.getColumn("amount", "outputs");
    private static readonly _amountPowerColumn = NodeConfiguration.getColumn("amount", "power");

    private static readonly _multipliersColumn = NodeConfiguration.getColumn("overclock", "multipliers");
    private static readonly _overclockInputsColumn = NodeConfiguration.getColumn("overclock", "inputs");
    private static readonly _overclockOutputsColumn = NodeConfiguration.getColumn("overclock", "outputs");
    private static readonly _overclockPowerColumn = NodeConfiguration.getColumn("overclock", "power");

    private static readonly _resetButton =
        NodeConfiguration.queryModalSuccessor(".reset-button") as HTMLDivElement;
    private static readonly _restoreButton =
        NodeConfiguration.queryModalSuccessor(".restore-button") as HTMLDivElement;
    private static readonly _applyButton =
        NodeConfiguration.queryModalSuccessor(".apply-button") as HTMLDivElement;
}


