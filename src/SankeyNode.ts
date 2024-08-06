import { SankeyLink } from "./SankeyLink";

export class SankeyNode
{
    constructor(
        public nodeGroup: SVGGElement,
        public leftLink?: SankeyLink,
        public rightLink?: SankeyLink,
    ) { }
}
