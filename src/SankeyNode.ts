import { SankeyLink } from "./SankeyLink";

export class SankeyNode
{
    constructor(
        public svgRect: SVGRectElement,
        public leftLink?: SankeyLink,
        public rightLink?: SankeyLink,
    ) { }
}
