// Ignore import error as the file only appears on launch of the exporting tool.
// @ts-ignore
import satisfactoryData from '../../dist/GameData/Satisfactory.json';

import { GameMachine } from "../GameData/GameMachine";
import { GameRecipe } from "../GameData/GameRecipe";
import { satisfactoryIconPath, toItemsInMinute } from "../GameData/GameData";
import { SvgFactory } from '../SVG/SvgFactory';

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

        this._machineConfigurator = this.generateConfigurator(
            machineIcon,
            1,
            ""
        );

        this.setupMachinesAmountConfigurator(this._machineConfigurator.inputElement);

        let overclockIcon = NodeConfiguration.createImgIcon(
            "Overclock",
            "Resource/Environment/Crystal/PowerShard.png"
        );

        this._overclockConfigurator = this.generateConfigurator(
            overclockIcon,
            100,
            "%"
        );

        this.setupOverclockConfigurator(this._overclockConfigurator.inputElement);

        let createResourceConfigurators = (
            resource: RecipeResource,
            amountConfigurators: Configurator[],
            overclockConfigurators: Configurator[]
        ): void =>
        {
            let resourceDesc = satisfactoryData.resources.find(
                // I specify type because deploy fails otherwise for some reason.
                (resourceData: typeof satisfactoryData.resources[0]) => 
                {
                    return resourceData.id == resource.id;
                }
            )!;

            let resourceIcon1 =
                NodeConfiguration.createImgIcon(resourceDesc.displayName, resourceDesc.iconPath);
            let resourceIcon2 =
                NodeConfiguration.createImgIcon(resourceDesc.displayName, resourceDesc.iconPath);

            let itemsInMinute = toItemsInMinute(resource.amount, recipe.manufacturingDuration);

            let amountConfigurator = this.generateConfigurator(
                resourceIcon1,
                itemsInMinute,
                "/min"
            );

            this.setupAmountInOutConfigurator(amountConfigurator.inputElement, itemsInMinute);

            amountConfigurators.push(amountConfigurator);

            let overclockConfigurator = this.generateConfigurator(
                resourceIcon2,
                itemsInMinute,
                "/min"
            );

            this.setupOverclockInOutConfigurator(overclockConfigurator.inputElement, itemsInMinute);

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

        let powerIcon1 = NodeConfiguration.createPowerSvgIcon();
        let powerIcon2 = NodeConfiguration.createPowerSvgIcon();

        this._amountConfigurators.powerConfigurator = this.generateConfigurator(
            powerIcon1,
            machine.powerConsumption,
            "MW"
        );

        this.setupAmountPowerConfigurator(
            this._amountConfigurators.powerConfigurator.inputElement,
            machine.powerConsumption,
            machine.powerConsumptionExponent
        );

        this._overclockConfigurators.powerConfigurator = this.generateConfigurator(
            powerIcon2,
            machine.powerConsumption,
            "MW"
        );

        this.setupOverclockPowerConfigurator(
            this._overclockConfigurators.powerConfigurator.inputElement,
            machine.powerConsumption,
            machine.powerConsumptionExponent
        );
    }

    private static numberParser(str: string)
    {
        let value1 = +str;
        let value2 = Number.parseFloat(str);

        // If any of the parsing methods results in NaN, we reject the value.
        if (Number.isNaN(value1) || Number.isNaN(value2) || value1 === 0)
        {
            return NaN;
        }

        return value1;
    };

    private setupMachinesAmountConfigurator(machinesAmount: HTMLInputElement)
    {
        machinesAmount.addEventListener("input", () =>
        {
            let value = NodeConfiguration.numberParser(machinesAmount.value);

            if (!Number.isNaN(value))
            {
                machinesAmount.classList.remove("error");
                this.setMachinesAmount(value);
            }
            else
            {
                machinesAmount.classList.add("error");
            }
        });

        let normalize = () =>
        {
            machinesAmount.classList.remove("error");
            machinesAmount.value = `${+this.getMachinesAmount().toFixed(4)}`;
        };

        machinesAmount.addEventListener("blur", normalize);
        machinesAmount.addEventListener("keydown", function (event)
        {
            if (event.repeat) { return; }

            if (event.key === "Enter")
            {
                machinesAmount.blur();
                normalize();
            }
        });

        this.addEventListener(NodeConfiguration.machinesAmountChangedEvent, () =>
        {
            let targetValue = this.getMachinesAmount();

            machinesAmount.value = `${+(targetValue).toFixed(4)}`;
        });
    }

    private setupOverclockConfigurator(overclock: HTMLInputElement)
    {
        overclock.addEventListener("input", () =>
        {
            let value = NodeConfiguration.numberParser(overclock.value);

            if (!Number.isNaN(value) && value >= 1 && value <= 250)
            {
                overclock.classList.remove("error");
                this.setOverclockRatio(value / 100);
            }
            else
            {
                overclock.classList.add("error");
            }
        });

        let normalize = () =>
        {
            overclock.classList.remove("error");

            let value = NodeConfiguration.numberParser(overclock.value);

            if (value < 1)
            {
                this.setOverclockRatio(1 / 100);
            }
            else if (value > 250)
            {
                this.setOverclockRatio(250 / 100);
            }
            else
            {
                overclock.value = `${+(this.getOverclockRatio() * 100).toFixed(4)}`;
            }
        };

        overclock.addEventListener("blur", normalize);
        overclock.addEventListener("keydown", function (event)
        {
            if (event.repeat) { return; }

            if (event.key === "Enter")
            {
                overclock.blur();
            }
        });

        this.addEventListener(NodeConfiguration.overclockChangedEvent, () =>
        {
            let targetValue = this.getOverclockRatio() * 100;

            overclock.value = `${+(targetValue).toFixed(4)}`;
        });
    }

    private setupAmountInOutConfigurator(amountInOut: HTMLInputElement, initialValue: number)
    {
        amountInOut.addEventListener("input", () =>
        {
            let value = NodeConfiguration.numberParser(amountInOut.value);

            if (!Number.isNaN(value))
            {
                amountInOut.classList.remove("error");
                this.setMachinesAmount(value / initialValue / this.getOverclockRatio());
            }
            else
            {
                amountInOut.classList.add("error");
            }
        });

        let normalize = () =>
        {
            amountInOut.classList.remove("error");

            amountInOut.value =
                `${+(initialValue * this.getOverclockRatio() * this.getMachinesAmount()).toFixed(4)}`;
        };

        amountInOut.addEventListener("blur", normalize);
        amountInOut.addEventListener("keydown", function (event)
        {
            if (event.repeat) { return; }

            if (event.key === "Enter")
            {
                amountInOut.blur();
            }
        });

        this.addEventListener(NodeConfiguration.machinesAmountChangedEvent, () =>
        {
            let targetValue = +(initialValue * this.getOverclockRatio() * this.getMachinesAmount()).toFixed(4);

            amountInOut.value = `${targetValue}`;
        });

        this.addEventListener(NodeConfiguration.overclockChangedEvent, () =>
        {
            let targetValue = +(initialValue * this.getOverclockRatio() * this.getMachinesAmount()).toFixed(4);

            amountInOut.value = `${targetValue}`;
        });
    }

    private setupAmountPowerConfigurator(
        amountPower: HTMLInputElement,
        initialValue: number,
        powerExponent: number)
    {
        amountPower.addEventListener("input", () =>
        {
            let value = NodeConfiguration.numberParser(amountPower.value);

            if (!Number.isNaN(value))
            {
                amountPower.classList.remove("error");

                let initialOverclockedValue =
                    (initialValue * Math.pow((this.getOverclockRatio()), powerExponent));

                this.setMachinesAmount(value / initialOverclockedValue);
            }
            else
            {
                amountPower.classList.add("error");
            }
        });

        let normalize = () =>
        {
            amountPower.classList.remove("error");

            let initialOverclockedValue =
                (initialValue * Math.pow((this.getOverclockRatio()), powerExponent));

            amountPower.value =
                `${+(initialOverclockedValue * this.getMachinesAmount()).toFixed(4)}`;
        };

        amountPower.addEventListener("blur", normalize);
        amountPower.addEventListener("keydown", function (event)
        {
            if (event.repeat) { return; }

            if (event.key === "Enter")
            {
                amountPower.blur();
            }
        });

        this.addEventListener(NodeConfiguration.machinesAmountChangedEvent, () =>
        {
            let initialOverclockedValue =
                (initialValue * Math.pow((this.getOverclockRatio()), powerExponent));

            let targetValue = +(initialOverclockedValue * this.getMachinesAmount()).toFixed(4);

            amountPower.value = `${targetValue}`;
        });

        this.addEventListener(NodeConfiguration.overclockChangedEvent, () =>
        {
            let initialOverclockedValue =
                (initialValue * Math.pow((this.getOverclockRatio()), powerExponent));

            let targetValue = +(initialOverclockedValue * this.getMachinesAmount()).toFixed(4);

            amountPower.value = `${targetValue}`;
        });
    }

    private setupOverclockInOutConfigurator(overclockInOut: HTMLInputElement, initialValue: number)
    {
        overclockInOut.addEventListener("input", () =>
        {
            let value = NodeConfiguration.numberParser(overclockInOut.value);

            if (!Number.isNaN(value))
            {
                overclockInOut.classList.remove("error");
                this.setOverclockRatio(value / initialValue);
            }
            else
            {
                overclockInOut.classList.add("error");
            }
        });

        let normalize = () =>
        {
            overclockInOut.classList.remove("error");

            overclockInOut.value =
                `${+(initialValue * this.getOverclockRatio()).toFixed(4)}`;
        };

        overclockInOut.addEventListener("blur", normalize);
        overclockInOut.addEventListener("keydown", function (event)
        {
            if (event.repeat) { return; }

            if (event.key === "Enter")
            {
                overclockInOut.blur();
            }
        });

        this.addEventListener(NodeConfiguration.machinesAmountChangedEvent, () =>
        {
            let targetValue = +(initialValue * this.getOverclockRatio()).toFixed(4);

            overclockInOut.value = `${targetValue}`;
        });

        this.addEventListener(NodeConfiguration.overclockChangedEvent, () =>
        {
            let targetValue = +(initialValue * this.getOverclockRatio()).toFixed(4);

            overclockInOut.value = `${targetValue}`;
        });
    }

    private setupOverclockPowerConfigurator(
        overclockPower: HTMLInputElement,
        initialValue: number,
        powerExponent: number)
    {
        overclockPower.addEventListener("input", () =>
        {
            let value = NodeConfiguration.numberParser(overclockPower.value);

            if (!Number.isNaN(value))
            {
                overclockPower.classList.remove("error");

                this.setOverclockRatio(Math.pow(value / initialValue, 1 / powerExponent));
            }
            else
            {
                overclockPower.classList.add("error");
            }
        });

        let normalize = () =>
        {
            overclockPower.classList.remove("error");

            overclockPower.value =
                `${+(initialValue * Math.pow(this.getOverclockRatio(), powerExponent)).toFixed(4)}`;
        };

        overclockPower.addEventListener("blur", normalize);
        overclockPower.addEventListener("keydown", function (event)
        {
            if (event.repeat) { return; }

            if (event.key === "Enter")
            {
                overclockPower.blur();
            }
        });

        this.addEventListener(NodeConfiguration.machinesAmountChangedEvent, () =>
        {
            overclockPower.value =
                `${+(initialValue * Math.pow(this.getOverclockRatio(), powerExponent)).toFixed(4)}`;
        });

        this.addEventListener(NodeConfiguration.overclockChangedEvent, () =>
        {
            overclockPower.value =
                `${+(initialValue * Math.pow(this.getOverclockRatio(), powerExponent)).toFixed(4)}`;
        });
    }

    private generateConfigurator(
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

        return new Configurator(editElement, inputElement, initialValue);
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

    private getMachinesAmount(): number
    {
        return this._machinesAmount;
    }

    private setMachinesAmount(value: number)
    {
        this._machinesAmount = value;
        this.dispatchEvent(new Event(NodeConfiguration.machinesAmountChangedEvent));
    }

    private getOverclockRatio(): number
    {
        return this._overclockRatio;
    }

    private setOverclockRatio(value: number)
    {
        value = Math.min(2.5, Math.max(0.01, value));
        this._overclockRatio = value;
        this.dispatchEvent(new Event(NodeConfiguration.overclockChangedEvent));
    }

    private _isOpened = false;
    private _machinesAmount = 1;
    private _overclockRatio = 1;

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
        public inputElement: HTMLInputElement,
        public initialValue: number)
    { };
}
