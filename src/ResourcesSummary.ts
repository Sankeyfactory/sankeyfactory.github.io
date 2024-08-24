// Ignore import error as the file only appears on launch of the exporting tool.
// @ts-ignore
import satisfactoryData from '../dist/GameData/Satisfactory.json';
import { satisfactoryIconPath } from './GameData/GameData';

import { SankeyNode } from "./Sankey/SankeyNode";

export class ResourcesSummary
{
    constructor()
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
        ResourcesSummary._inputsColumn.querySelectorAll(".resource").forEach(resource =>
        {
            resource.remove();
        });

        let isAnyAdded = false;

        for (const node of this._nodes)
        {
            for (const resource of node.missingResources)
            {
                ResourcesSummary._inputsColumn.appendChild(
                    this.createResourceDisplay(resource.id, resource.amount)
                );

                isAnyAdded = true;
            }
        }

        if (!isAnyAdded)
        {
            let noneText = document.createElement("div");
            noneText.classList.add("resource", "none");
            noneText.innerText = "None";

            ResourcesSummary._inputsColumn.appendChild(noneText);
        }

        if (this._isCollapsed)
        {
            ResourcesSummary.setCollapsingAnimationEnabled(false);
            this.hideContent();
            ResourcesSummary.setCollapsingAnimationEnabled(true);
        }
    }

    private recalculateOutputs(): void
    {
        ResourcesSummary._outputsColumn.querySelectorAll(".resource").forEach(resource =>
        {
            resource.remove();
        });

        let isAnyAdded = false;

        for (const node of this._nodes)
        {
            for (const resource of node.exceedingResources)
            {
                ResourcesSummary._outputsColumn.appendChild(
                    this.createResourceDisplay(resource.id, resource.amount)
                );

                isAnyAdded = true;
            }
        }

        if (!isAnyAdded)
        {
            let noneText = document.createElement("div");
            noneText.classList.add("resource", "none");
            noneText.innerText = "None";

            ResourcesSummary._outputsColumn.appendChild(noneText);
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

    private createResourceDisplay(id: string, amount: number): HTMLDivElement
    {
        // <div class="resource">
        //     <img src="GameData/SatisfactoryIcons/Resource/Parts/AIlimiter/AILimiter.png" title="AI Limiter"
        //         alt="AI Limiter" class="icon">
        //     <div class="amount">12345.678/min</div>
        // </div>

        let resource = satisfactoryData.resources.find(
            // I specify type because deploy fails otherwise for some reason.
            (resource: typeof satisfactoryData.resources[0]) => 
            {
                return resource.id == id;
            }
        );

        if (resource == undefined)
        {
            throw Error(`Couldn't find resource ${id}`);
        }

        let resourceDisplay = document.createElement("div");
        resourceDisplay.classList.add("resource");

        let icon = document.createElement("img");
        icon.classList.add("icon");

        icon.src = satisfactoryIconPath(resource.iconPath);
        icon.title = resource.displayName;
        icon.alt = resource.displayName;

        let amountDisplay = document.createElement("div");
        amountDisplay.classList.add("amount");

        amountDisplay.innerText = `${amount}`;

        resourceDisplay.appendChild(icon);
        resourceDisplay.appendChild(amountDisplay);

        return resourceDisplay;
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
            ResourcesSummary._summaryContainer.classList.add("animate-collapsing");
        }
        else
        {
            ResourcesSummary._summaryContainer.classList.remove("animate-collapsing");
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
