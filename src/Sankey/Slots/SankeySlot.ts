import { Rectangle } from "../../Rectangle";
import { SvgFactory } from "../../SVG/SvgFactory";
import { SlotsGroup } from "../SlotsGroup";

export abstract class SankeySlot extends EventTarget
{
    public static readonly slotWidth = 10;

    public static readonly boundsChangedEvent = "bounds-changed";
    public static readonly deletionEvent = "deleted";

    constructor(
        slotsGroup: SlotsGroup,
        slotsGroupSvg: SVGGElement,
        resource: RecipeResource,
        ...classes: string[])
    {
        super();

        this._resource = { ...resource };
        this._parentGroup = slotsGroup;

        let dimensions: Rectangle = {
            width: SankeySlot.slotWidth,
            height: 0,
            x: 0,
            y: 0
        };

        this._slotSvgRect = SvgFactory.createSvgRect(dimensions, ...classes);
        slotsGroupSvg.appendChild(this.slotSvgRect);

        this.updateHeight();
    }

    public setYPosition(yPosition: number): void
    {
        this.slotSvgRect.setAttribute("y", `${yPosition}`);

        this.dispatchEvent(new Event(SankeySlot.boundsChangedEvent));
    }

    public delete(): void
    {
        this.dispatchEvent(new Event(SankeySlot.deletionEvent));

        this.slotSvgRect.remove();
    }

    public get resourcesAmount()
    {
        return this._resource.amount;
    }

    public set resourcesAmount(resourcesAmount: number)
    {
        this._resource.amount = resourcesAmount;

        this.updateHeight();

        this.dispatchEvent(new Event(SankeySlot.boundsChangedEvent));
    }

    public get resourceId(): string
    {
        return this._resource.id;
    }

    public get slotSvgRect(): SVGRectElement
    {
        return this._slotSvgRect;
    }

    public updateHeight(): void
    {
        let resourcesQuotient = this.resourcesAmount / this._parentGroup.resourcesAmount;

        this.slotSvgRect.setAttribute(
            "height",
            `${this._parentGroup.height * (resourcesQuotient)}`
        );

        this.dispatchEvent(new Event(SankeySlot.boundsChangedEvent));
    }

    protected get parentGroup(): SlotsGroup
    {
        return this._parentGroup;
    }

    private readonly _resource: RecipeResource;

    private readonly _slotSvgRect: SVGRectElement;

    private readonly _parentGroup: SlotsGroup;
}
