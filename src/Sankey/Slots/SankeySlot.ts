import { Rectangle } from "../../Rectangle";
import { SvgFactory } from "../../SVG/SvgFactory";
import { SlotsGroup } from "../SlotsGroup";

export abstract class SankeySlot extends EventTarget
{
    public static readonly slotWidth = 10;

    public static readonly boundsChangedEvent = "bounds-changed";

    constructor(
        slotsGroup: SlotsGroup,
        slotsGroupSvg: SVGGElement,
        resourcesAmount: number,
        ...classes: string[])
    {
        super();

        this._resourcesAmount = resourcesAmount;
        this._parentGroup = slotsGroup;

        let dimensions: Rectangle = {
            width: SankeySlot.slotWidth,
            height: slotsGroup.maxHeight * (resourcesAmount / slotsGroup.resourcesAmount),
            x: 0,
            y: 0
        };

        this._slotSvgRect = SvgFactory.createSvgRect(dimensions, ...classes);
        slotsGroupSvg.appendChild(this.slotSvgRect);
    }

    public setYPosition(yPosition: number): void
    {
        this.slotSvgRect.setAttribute("y", `${yPosition}`);

        this.dispatchEvent(new Event(SankeySlot.boundsChangedEvent));
    }

    public get resourcesAmount()
    {
        return this._resourcesAmount;
    }

    public set resourcesAmount(resourcesAmount: number)
    {
        this._resourcesAmount = resourcesAmount;

        this.slotSvgRect.setAttribute(
            "height",
            `${this._parentGroup.maxHeight * (resourcesAmount / this._parentGroup.resourcesAmount)}`
        );

        this.dispatchEvent(new Event(SankeySlot.boundsChangedEvent));
    }

    public get slotSvgRect(): SVGRectElement
    {
        return this._slotSvgRect;
    }

    protected get parentGroup(): SlotsGroup
    {
        return this._parentGroup;
    }

    private _resourcesAmount: number;

    private readonly _slotSvgRect: SVGRectElement;

    private readonly _parentGroup: SlotsGroup;
}
