import { Point } from "./Point";

export class Curve
{
    public startPoint: Point = { x: 0, y: 0 };
    public startDeviationPoint: Point = { x: 0, y: 0 };
    public endDeviationPoint: Point = { x: 0, y: 0 };
    public endPoint: Point = { x: 0, y: 0 };

    public static fromTwoPoints(startPoint: Point, endPoint: Point): Curve
    {
        return {
            startPoint: startPoint,
            endPoint: endPoint,
            startDeviationPoint: {
                x: (startPoint.x + endPoint.x) / 2,
                y: startPoint.y
            },
            endDeviationPoint: {
                x: (startPoint.x + endPoint.x) / 2,
                y: endPoint.y
            },
        };
    }
}
