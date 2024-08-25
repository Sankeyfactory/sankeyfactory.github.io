import { satisfactoryIconPath } from "../../GameData/GameData";
import { SvgIcons } from "../../SVG/SvgIcons";
import { NodeConfiguration } from "./NodeConfiguration";

export class ConfiguratorBuilder
{
    public constructor(nodeConfig: NodeConfiguration)
    {
        this._nodeConfig = nodeConfig;

        this._editElement = document.createElement("div");
        this._editElement.classList.add("edit");

        this._iconContainer = document.createElement("div");
        this._iconContainer.classList.add("icon-container");

        this._inputElement = document.createElement("input");

        this._unitsElement = document.createElement("div");
        this._unitsElement.classList.add("units");

        this._editElement.appendChild(this._iconContainer);
        this._editElement.appendChild(this._inputElement);
        this._editElement.appendChild(this._unitsElement);
    }

    public build(): HTMLDivElement
    {
        if (this._minimumGetter == undefined
            || this._maximumGetter == undefined
            || this._relatedPropertyGetter == undefined
            || this._relatedPropertySetter == undefined
        )
        {
            throw Error("Configurator builder can't build without required fields");
        }

        let meetsTheMinimum = (value: number): boolean =>
        {
            let minimum = this._minimumGetter!();
            return minimum == undefined || value >= minimum;
        };

        let meetsTheMaximum = (value: number): boolean =>
        {
            let maximum = this._maximumGetter!();
            return maximum == undefined || value <= maximum;
        };

        let toFixed = ConfiguratorBuilder.configuratorToFixed;

        this._inputElement.addEventListener("input", () =>
        {
            let value = ConfiguratorBuilder.numberParser(this._inputElement.value);

            if (value != undefined && meetsTheMinimum(value) && meetsTheMaximum(value))
            {
                this._inputElement.classList.remove("error");

                this._relatedPropertySetter!(toFixed(value));
            }
            else
            {
                this._inputElement.classList.add("error");
            }
        });

        this._inputElement.addEventListener("blur", () =>
        {
            this._inputElement.classList.remove("error");

            let value = ConfiguratorBuilder.numberParser(this._inputElement.value);

            if (value != undefined)
            {
                if (!meetsTheMinimum(value))
                {
                    this._relatedPropertySetter!(this._minimumGetter!()!,);
                }
                else if (!meetsTheMaximum(value))
                {
                    this._relatedPropertySetter!(this._maximumGetter!()!,);
                }
            }

            this._inputElement.value = `${toFixed(this._relatedPropertyGetter!())}`;
        });

        this._inputElement.addEventListener("keydown", (event) =>
        {
            if (event.repeat) { return; }

            if (event.key === "Enter")
            {
                this._inputElement.blur();
            }

            event.stopPropagation();
        });

        return this._editElement;
    }

    public subscribeToMachinesAmount(): this 
    {
        this._nodeConfig.addEventListener(
            NodeConfiguration.machinesAmountChangedEvent,
            this.updateInputValue.bind(this)
        );

        return this;
    }

    public subscribeToOverclock(): this 
    {
        this._nodeConfig.addEventListener(
            NodeConfiguration.overclockChangedEvent,
            this.updateInputValue.bind(this)
        );

        return this;
    }

    public setMinimum(minimumGetter: () => number | undefined): this
    {
        this._minimumGetter = minimumGetter;

        return this;
    }

    public setMaximum(maximumGetter: () => number | undefined): this
    {
        this._maximumGetter = maximumGetter;

        return this;
    }

    public setRelatedProperty(
        getter: () => number,
        setter: (value: number) => void,
    ): this
    {
        this._relatedPropertyGetter = getter;
        this._relatedPropertySetter = setter;

        return this;
    }

    public setInitialValue(initialValue: number): this
    {
        this._inputElement.value = `${initialValue}`;
        return this;
    }

    public setUnits(units: string): this
    {
        this._unitsElement.innerText = units;
        return this;
    }

    public setIconImage(name: string, iconPath: string): this
    {
        let icon = document.createElement("img");

        icon.src = satisfactoryIconPath(iconPath);
        icon.alt = name;

        this._iconContainer.title = name;

        this._iconContainer.appendChild(icon);

        return this;
    }

    public setPowerSvgIcon(): this
    {
        let icon = SvgIcons.createIcon("power");

        this._iconContainer.title = "Power consumption";

        this._iconContainer.appendChild(icon);

        return this;
    }

    private updateInputValue()
    {
        if (this._relatedPropertyGetter == undefined)
        {
            throw Error("Configurator builder can't build without required fields");
        }

        // Prevent changing the input user currently changes.
        if (!Object.is(document.activeElement, this._inputElement))
        {
            let toFixed = ConfiguratorBuilder.configuratorToFixed;

            this._inputElement.value = `${toFixed(this._relatedPropertyGetter())}`;
        }
    }

    private static configuratorToFixed(value: number): number
    {
        return +(value).toFixed(4);
    }

    private static numberParser(str: string): number | undefined
    {
        let value1 = +str;
        let value2 = Number.parseFloat(str);

        // If any of the parsing methods results in NaN, we reject the value.
        if (Number.isNaN(value1) || Number.isNaN(value2))
        {
            return undefined;
        }

        return value1;
    };

    private _nodeConfig: NodeConfiguration;

    private _editElement: HTMLDivElement;
    private _iconContainer: HTMLDivElement;
    private _inputElement: HTMLInputElement;
    private _unitsElement: HTMLDivElement;

    private _minimumGetter?: () => number | undefined;
    private _maximumGetter?: () => number | undefined;
    private _relatedPropertyGetter?: () => number;
    private _relatedPropertySetter?: (value: number) => void;
}
