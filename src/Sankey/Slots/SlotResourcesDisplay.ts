import { loadSatisfactoryResource, satisfactoryIconPath } from "../../GameData/GameData";
import { SvgFactory } from "../../SVG/SvgFactory";
import { Settings } from "../../Settings";
import { SankeySlot } from "./SankeySlot";

export class SlotResourcesDisplay
{
    constructor(relatedSlot: SankeySlot, slotsGroup: SVGGElement, isDirectedLeft: boolean)
    {
        this._relatedSlot = relatedSlot;
        this._slotsGroup = slotsGroup;
        this._isDirectedLeft = isDirectedLeft;

        this._resourcesDisplay = SvgFactory.createSvgForeignObject("resources-display");
        this._resourcesAmountDisplay = document.createElement("div");

        this.createResourceDisplay();
        this.update();

        this._relatedSlot.addEventListener(SankeySlot.boundsChangedEvent, this.update.bind(this));
    }

    private createResourceDisplay(): void
    {
        let displayContainer = document.createElement("div");

        let resource = loadSatisfactoryResource(this._relatedSlot.resourceId);

        let icon = document.createElement("img");
        icon.classList.add("icon");
        icon.src = satisfactoryIconPath(resource.iconPath);
        icon.title = resource.displayName;
        icon.alt = resource.displayName;

        this._resourcesAmountDisplay.classList.add("amount");

        displayContainer.appendChild(icon);
        displayContainer.appendChild(this._resourcesAmountDisplay);

        this._resourcesDisplay.appendChild(displayContainer);

        this._slotsGroup.appendChild(this._resourcesDisplay);

        Settings.instance.addEventListener(Settings.zoomChangedEvent, () =>
        {
            displayContainer.style.padding = `0 ${10 / Settings.instance.zoom}px`;
            displayContainer.style.gap = `${4 / Settings.instance.zoom}px`;
            this.update();
        });
    }

    private update(): void
    {
        if (this._relatedSlot.resourcesAmount === 0)
        {
            this._resourcesDisplay.classList.add("hidden");
        }
        else
        {
            this._resourcesDisplay.classList.remove("hidden");

            let displayHeight = 24 / Settings.instance.zoom;

            this._resourcesAmountDisplay.style.fontSize = `${displayHeight * 0.6}px`;
            this._resourcesAmountDisplay.innerText = `${+this._relatedSlot.resourcesAmount.toFixed(3)}`;

            let slotHeight = +this._relatedSlot.slotSvgRect.getAttribute("height")!;
            let slotY = +this._relatedSlot.slotSvgRect.getAttribute("y")!;

            let xOffset = this._isDirectedLeft ? 0 : SankeySlot.slotWidth;

            this._resourcesDisplay.setAttribute("height", `${displayHeight}`);
            this._resourcesDisplay.setAttribute("width", "1");
            this._resourcesDisplay.setAttribute("x", `${xOffset}`);
            this._resourcesDisplay.setAttribute("y", `${slotY + slotHeight / 2 - displayHeight / 2}`);
        }
    }

    private _relatedSlot: SankeySlot;

    private _isDirectedLeft: boolean;

    private _slotsGroup: SVGGElement;
    private _resourcesDisplay: SVGForeignObjectElement;
    private _resourcesAmountDisplay: HTMLDivElement;
}
