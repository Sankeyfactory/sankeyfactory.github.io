import { loadSatisfactoryResource, satisfactoryIconPath } from "../../GameData/GameData";
import { HtmlUtils } from "../../DomUtils/HtmlUtils";
import { SvgFactory } from "../../DomUtils/SvgFactory";
import { Settings } from "../../Settings";
import { SankeySlot } from "./SankeySlot";

export class SlotResourcesDisplay
{
    constructor(relatedSlot: SankeySlot, slotsGroup: SVGGElement, type: "input" | "output")
    {
        this._relatedSlot = relatedSlot;
        this._slotsGroup = slotsGroup;
        this._type = type;

        this._resourcesDisplay = SvgFactory.createSvgForeignObject("resources-display");
        this._resourcesAmountDisplay = HtmlUtils.createHtmlElement("div");

        this.createResourceDisplay();

        this._relatedSlot.addEventListener(SankeySlot.boundsChangedEvent, this.update.bind(this));
    }

    private createResourceDisplay(): void
    {
        let displayContainer = HtmlUtils.createHtmlElement("div");

        let resource = loadSatisfactoryResource(this._relatedSlot.resourceId);

        let icon = HtmlUtils.createHtmlElement("img", "icon");
        icon.src = satisfactoryIconPath(resource.iconPath);
        icon.title = resource.displayName;
        icon.alt = resource.displayName;

        this._resourcesAmountDisplay.classList.add("amount");

        displayContainer.appendChild(icon);
        displayContainer.appendChild(this._resourcesAmountDisplay);

        this._resourcesDisplay.appendChild(displayContainer);

        this._slotsGroup.appendChild(this._resourcesDisplay);

        let updateZoomSize = () =>
        {
            let zoomScale = Math.max(
                SlotResourcesDisplay._minZoomMultiplier,
                Math.min(SlotResourcesDisplay._maxZoomMultiplier, Settings.instance.zoom)
            );

            displayContainer.style.padding = `0 ${10 / zoomScale}px`;
            displayContainer.style.gap = `${4 / zoomScale}px`;
            this.update();
        };

        updateZoomSize();

        Settings.instance.addEventListener(Settings.zoomChangedEvent, updateZoomSize);

        Settings.instance.addEventListener(Settings.connectingResourceIdChangedEvent, () =>
        {
            let resource = Settings.instance.connectingResource;

            this._resourcesDisplay.classList.remove("correct");
            this._resourcesDisplay.classList.remove("wrong");

            if (resource != undefined)
            {
                if (resource.id === this._relatedSlot.resourceId && resource.type !== this._type)
                {
                    this._resourcesDisplay.classList.add("correct");
                    this._resourcesDisplay.classList.remove("wrong");
                }
                else 
                {
                    this._resourcesDisplay.classList.add("wrong");
                    this._resourcesDisplay.classList.remove("correct");
                }
            }
        });
    }

    private update(): void
    {
        let resourcesAmount = +this._relatedSlot.resourcesAmount.toFixed(3);

        if (resourcesAmount === 0)
        {
            this._resourcesDisplay.classList.add("hidden");
        }
        else
        {
            this._resourcesDisplay.classList.remove("hidden");

            let zoomScale = Math.max(
                SlotResourcesDisplay._minZoomMultiplier,
                Math.min(SlotResourcesDisplay._maxZoomMultiplier, Settings.instance.zoom)
            );
            let displayHeight = 24 / zoomScale;

            this._resourcesAmountDisplay.style.fontSize = `${displayHeight * 0.6}px`;
            this._resourcesAmountDisplay.innerText = `${resourcesAmount}`;

            let slotHeight = +this._relatedSlot.slotSvgRect.getAttribute("height")!;
            let slotY = +this._relatedSlot.slotSvgRect.getAttribute("y")!;

            let xOffset = this._type === "input" ? 0 : SankeySlot.slotWidth;

            this._resourcesDisplay.setAttribute("height", `${displayHeight}`);
            this._resourcesDisplay.setAttribute("width", "1");
            this._resourcesDisplay.setAttribute("x", `${xOffset}`);
            this._resourcesDisplay.setAttribute("y", `${slotY + slotHeight / 2 - displayHeight / 2}`);
        }
    }

    private _relatedSlot: SankeySlot;

    private _type: string;

    private _slotsGroup: SVGGElement;
    private _resourcesDisplay: SVGForeignObjectElement;
    private _resourcesAmountDisplay: HTMLDivElement;

    private static _minZoomMultiplier = 0.5;
    private static _maxZoomMultiplier = 1.5;
}
