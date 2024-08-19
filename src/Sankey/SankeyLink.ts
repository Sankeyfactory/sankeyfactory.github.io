import { PanZoom } from "panzoom";
import { Curve } from "../Curve";
import { Rectangle } from "../Rectangle";
import { SvgFactory } from "../SVG/SvgFactory";
import { SvgPathBuilder } from "../SVG/SvgPathBuilder";
import { SankeySlot } from "./Slots/SankeySlot";

export class SankeyLink
{
    public static connect(firstSlot: SankeySlot, secondSlot: SankeySlot, panContext: PanZoom) 
    {
        let link = new SankeyLink(firstSlot, secondSlot, panContext);

        document.querySelector("#viewport")?.appendChild(link._svgPath);
    }

    constructor(firstSlot: SankeySlot, secondSlot: SankeySlot, panContext: PanZoom)
    {
        this._firstSlot = firstSlot;
        this._secondSlot = secondSlot;
        this._panContext = panContext;

        firstSlot.addEventListener(SankeySlot.boundsChangedEvent, this.recalculate.bind(this));
        secondSlot.addEventListener(SankeySlot.boundsChangedEvent, this.recalculate.bind(this));

        this._svgPath = SvgFactory.createSvgPath("link");
        this.recalculate();
    }

    public recalculate(): void
    {
        let first = Rectangle.fromSvgBounds(this._firstSlot.slotSvgRect, this._panContext);
        let second = Rectangle.fromSvgBounds(this._secondSlot.slotSvgRect, this._panContext);

        let curve1 = Curve.fromTwoPoints(
            { x: first.x + first.width, y: first.y },
            { x: second.x, y: second.y }
        );

        let curve2 = Curve.fromTwoPoints(
            { x: second.x, y: second.y + second.height },
            { x: first.x + first.width, y: first.y + first.height },
        );

        let svgPath = new SvgPathBuilder()
            .startAt(curve1.startPoint)
            .curve(curve1)
            .verticalLineTo(curve1.endPoint.y + second.height)
            .curve(curve2)
            .verticalLineTo(curve1.startPoint.y)
            .build();

        this._svgPath.setAttribute("d", svgPath);

        // For cutting-out stroke on the outside of the shape.
        this._svgPath.style.clipPath = `view-box path("${svgPath}")`;
    }

    private _firstSlot: SankeySlot;
    private _secondSlot: SankeySlot;
    private _panContext: PanZoom;
    private _svgPath: SVGPathElement;
}
