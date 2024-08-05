import { Point } from "./Point";
import { Rectangle } from "./Rectangle";
import { SankeyNode } from "./SankeyNode";

export class SankeyLink {
    constructor(
        public firstNode: SankeyNode,
        public secondNode: SankeyNode,
        public svgPath: SVGPathElement
    ) { }

    recalculate() {
        if (this.firstNode == null || this.secondNode == null) {
            return;
        }

        let first = new Rectangle(
            +this.firstNode.svgRect.getAttribute("x")!,
            +this.firstNode.svgRect.getAttribute("y")!,
            +this.firstNode.svgRect.getAttribute("width")!,
            +this.firstNode.svgRect.getAttribute("height")!,
        );

        let second = new Rectangle(
            +this.secondNode.svgRect.getAttribute("x")!,
            +this.secondNode.svgRect.getAttribute("y")!,
            +this.secondNode.svgRect.getAttribute("width")!,
            +this.secondNode.svgRect.getAttribute("height")!,
        );

        let c1p1 = new Point(first.x + first.width, first.y); // curve 1, point 1
        let c1p4 = new Point(second.x, second.y); // curve 1, point 4
        let c1p2 = new Point((c1p1.x + c1p4.x) / 2, first.y); // curve 1, point 2
        let c1p3 = new Point((c1p1.x + c1p4.x) / 2, second.y); // curve 1, point 3

        let curve1 = `M ${c1p1.x} ${c1p1.y} C ${c1p2.x} ${c1p2.y} ${c1p3.x} ${c1p3.y} ${c1p4.x} ${c1p4.y}`;

        let c2p1 = new Point(c1p4.x, second.y); // curve 2, point 1
        let c2p4 = new Point(first.x + first.width, first.y + first.height); // curve 2, point 4
        let c2p2 = new Point((c2p1.x + c2p4.x) / 2, second.y + second.height); // curve 2, point 2
        let c2p3 = new Point((c2p1.x + c2p4.x) / 2, first.y + first.height); // curve 2, point 3

        let curve2 = `C ${c2p2.x} ${c2p2.y} ${c2p3.x} ${c2p3.y} ${c2p4.x} ${c2p4.y}`;

        this.svgPath.setAttribute("d", `${curve1} V ${second.y + second.height} ${curve2} V ${first.y}`);
        this.svgPath.style.clipPath = `view-box path("${curve1} V ${second.y + second.height} ${curve2} V ${first.y}")`;
    }
}
