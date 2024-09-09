import { SankeyNode } from "./Sankey/SankeyNode";
import { loadSatisfactoryResource, satisfactoryIconPath } from './GameData/GameData';
import { SvgIcons } from './DomUtils/SvgIcons';
import { HtmlUtils } from "./DomUtils/HtmlUtils";

export class ResourcesSummary
{
    public constructor()
    {
        ResourcesSummary._collapseButton.addEventListener("click", () =>
        {
            if (this._isCollapsed)
            {
                this.open();
            }
            else
            {
                this.close();
            }
        });

        this.recalculateInputs();
        this.recalculateOutputs();
    }

    public registerNode(node: SankeyNode)
    {
        this._nodes.push(node);

        this.recalculateInputs();
        this.recalculateOutputs();

        node.addEventListener(SankeyNode.changedVacantResourcesAmountEvent, () =>
        {
            this.recalculateInputs();
            this.recalculateOutputs();
        });

        node.addEventListener(SankeyNode.deletionEvent, () =>
        {
            let index = this._nodes.findIndex(registeredNode => Object.is(node, registeredNode));

            this._nodes.splice(index, 1);

            this.recalculateInputs();
            this.recalculateOutputs();
        });
    }

    private recalculateInputs(): void
    {
        let resources = new Map<string, number>();
        let powerConsumption = 0;
        let requiredPowerShards = 0;

        for (const node of this._nodes)
        {
            for (const resource of node.missingResources)
            {
                if (+resource.amount.toFixed(3) > 0)
                {
                    resources.set(resource.id, (resources.get(resource.id) ?? 0) + resource.amount);
                }
            }

            if (+node.powerConsumption.toFixed(3) > 0)
            {
                powerConsumption += node.powerConsumption;
            }

            requiredPowerShards += node.requiredPowerShards;
        }

        this.recalculate(ResourcesSummary._inputsColumn, resources, powerConsumption, requiredPowerShards);
    }

    private recalculateOutputs(): void
    {
        let resources = new Map<string, number>();

        for (const node of this._nodes)
        {
            for (const resource of node.exceedingResources)
            {
                if (+resource.amount.toFixed(3) > 0)
                {
                    resources.set(resource.id, (resources.get(resource.id) ?? 0) + resource.amount);
                }
            }
        }

        this.recalculate(ResourcesSummary._outputsColumn, resources, 0, 0);
    }

    private recalculate(
        column: HTMLDivElement,
        resources: Map<string, number>,
        powerConsumption: number,
        requiredPowerShards: number,
    )
    {
        column.querySelectorAll(".resource").forEach(resource =>
        {
            resource.remove();
        });

        let isAnyAdded = false;

        if (powerConsumption !== 0)
        {
            column.appendChild(this.createPowerDisplay(powerConsumption));

            isAnyAdded = true;
        }

        if (requiredPowerShards !== 0)
        {
            column.appendChild(this.createResourceDisplay("Desc_CrystalShard_C", requiredPowerShards, ""));

            isAnyAdded = true;
        }

        let power = resources.get("Power");
        if (power != undefined)
        {
            column.appendChild(this.createResourceDisplay("Power", power, " MW"));

            resources.delete("Power");

            isAnyAdded = true;
        }

        for (const [id, amount] of resources)
        {
            column.appendChild(this.createResourceDisplay(id, amount, "/min"));

            isAnyAdded = true;
        }

        if (!isAnyAdded)
        {
            let noneText = HtmlUtils.createHtmlElement("div", "resource", "none");
            noneText.innerText = "None";

            column.appendChild(noneText);
        }

        if (this._isCollapsed)
        {
            ResourcesSummary.setCollapsingAnimationEnabled(false);
            this.hideContent();
            ResourcesSummary.setCollapsingAnimationEnabled(true);
        }
    }

    private open(): void
    {
        ResourcesSummary._summaryContainer.classList.remove("collapsed");
        ResourcesSummary._summaryContainer.style.top = "0";

        this._isCollapsed = false;
    }

    private close(): void
    {
        ResourcesSummary._summaryContainer.classList.add("collapsed");

        this.hideContent();

        this._isCollapsed = true;
    }

    private hideContent(): void
    {
        let contentHeight = ResourcesSummary.querySuccessor(".content").clientHeight;

        ResourcesSummary._summaryContainer.style.top = `${-contentHeight}px`;
    }

    private createResourceDisplay(id: string, amount: number, suffix: string): HTMLDivElement
    {
        let resource = loadSatisfactoryResource(id);

        let resourceDisplay = HtmlUtils.createHtmlElement("div", "resource");

        let icon = HtmlUtils.createHtmlElement("img", "icon");

        icon.src = satisfactoryIconPath(resource.iconPath);
        icon.title = resource.displayName;
        icon.alt = resource.displayName;

        let amountDisplay = HtmlUtils.createHtmlElement("div", "amount");

        amountDisplay.innerText = `${+amount.toFixed(3)}${suffix}`;

        resourceDisplay.appendChild(icon);
        resourceDisplay.appendChild(amountDisplay);

        return resourceDisplay;
    }

    private createPowerDisplay(powerConsumption: number): HTMLDivElement
    {
        let powerDisplay = HtmlUtils.createHtmlElement("div", "resource");

        let icon = SvgIcons.createIcon("power");
        icon.classList.add("icon");

        let amountDisplay = HtmlUtils.createHtmlElement("div", "amount");

        amountDisplay.innerText = `${+powerConsumption.toFixed(3)} MW`;

        powerDisplay.appendChild(icon);
        powerDisplay.appendChild(amountDisplay);

        return powerDisplay;
    }

    private static querySuccessor(query: string): Element
    {
        let element = ResourcesSummary._summaryContainer.querySelector(`${query}`);

        if (element == null)
        {
            throw Error(`Couldn't find required element: ${query} of summary container`);
        }

        return element;
    }

    private static setCollapsingAnimationEnabled(enabled: boolean)
    {
        if (enabled)
        {
            this._summaryContainer.classList.add("animate-collapsing");
        }
        else
        {
            this._summaryContainer.classList.remove("animate-collapsing");
        }
    }

    private _isCollapsed = false;

    private _nodes: SankeyNode[] = [];

    private static readonly _summaryContainer =
        document.querySelector("#resources-summary") as HTMLDivElement;

    private static readonly _inputsColumn =
        ResourcesSummary.querySuccessor(".column.inputs") as HTMLDivElement;
    private static readonly _outputsColumn =
        ResourcesSummary.querySuccessor(".column.outputs") as HTMLDivElement;

    private static readonly _collapseButton =
        ResourcesSummary.querySuccessor(".collapse-button") as HTMLDivElement;
}
