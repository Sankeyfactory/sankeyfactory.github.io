import { Curve } from "./Curve";
import { Point } from "./Point";

export class SvgPathBuilder
{
    private path: string = "";

    public startAt(point: Point): this
    {
        return this.pointAt(point);
    }

    public pointAt(point: Point): this
    {
        this.path += `M ${point.x} ${point.y} `;

        return this;
    }

    // Start point will be ignored because that's how SVG works.
    public curve(curve: Curve): this
    {
        this.path +=
            `C ${curve.startDeviationPoint.x} ${curve.startDeviationPoint.y} `
            + `${curve.endDeviationPoint.x} ${curve.endDeviationPoint.y} `
            + `${curve.endPoint.x} ${curve.endPoint.y} `;

        return this;
    }

    public verticalLineTo(y: number): this
    {
        this.path += `V ${y} `;

        return this;
    }

    public build(): string
    {
        return this.path;
    }
}
