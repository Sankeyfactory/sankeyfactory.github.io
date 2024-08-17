import { PanZoom } from "panzoom";
import { Curve } from "../Curve";
import { Rectangle } from "../Rectangle";
import { SvgFactory } from "../SVG/SvgFactory";
import { SvgPathBuilder } from "../SVG/SvgPathBuilder";
import { SankeySlot } from "./Slots/SankeySlot";

export class SankeyLink
{
    private svgPath: SVGPathElement;

    constructor(
        private firstSlot: SankeySlot,
        private secondSlot: SankeySlot,
        private panContext: PanZoom
    )
    {
        this.svgPath = SvgFactory.createSvgPath("link");
        this.recalculate();

        document.querySelector("#viewport")?.appendChild(this.svgPath);
    }

    public recalculate(): void
    {
        let first = Rectangle.fromSvgBounds(this.firstSlot.slotSvg, this.panContext);
        let second = Rectangle.fromSvgBounds(this.secondSlot.slotSvg, this.panContext);

        let curve1 = new Curve();

        curve1.startPoint = {
            x: first.x + first.width,
            y: first.y
        };
        curve1.endPoint = {
            x: second.x,
            y: second.y
        };
        curve1.startDeviationPoint = {
            x: (curve1.startPoint.x + curve1.endPoint.x) / 2,
            y: first.y
        };
        curve1.endDeviationPoint = {
            x: (curve1.startPoint.x + curve1.endPoint.x) / 2,
            y: second.y
        };

        let curve2 = new Curve();

        curve2.startPoint = {
            x: curve1.endPoint.x,
            y: second.y
        };
        curve2.endPoint = {
            x: first.x + first.width,
            y: first.y + first.height
        };
        curve2.startDeviationPoint = {
            x: (curve2.startPoint.x + curve2.endPoint.x) / 2,
            y: second.y + second.height
        };
        curve2.endDeviationPoint = {
            x: (curve2.startPoint.x + curve2.endPoint.x) / 2,
            y: first.y + first.height
        };

        let svgPath = new SvgPathBuilder()
            .startAt(curve1.startPoint)
            .curve(curve1)
            .verticalLineTo(curve1.endPoint.y + second.height)
            .curve(curve2)
            .verticalLineTo(curve1.startPoint.y)
            .build();

        this.svgPath.setAttribute("d", svgPath);

        // For cutting-out stroke on the outside of the shape.
        this.svgPath.style.clipPath = `view-box path("${svgPath}")`;
    }
}