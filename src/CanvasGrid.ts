import { Point } from "./Geometry/Point";
import { PanZoomConfiguration } from "./PanZoomConfiguration";
import { Settings } from "./Settings";

export class CanvasGrid
{
    public static alignPoint(point: Point)
    {
        let stepRound = (value: number, step: number, offset: number) =>
        {
            return Math.round((value + offset) / step) * step + offset;
        };

        let x = stepRound(point.x, CanvasGrid.smallGridSize, CanvasGrid.smallGridSize / 2);
        let y = stepRound(point.y, CanvasGrid.smallGridSize, CanvasGrid.smallGridSize / 2);

        return { x: x, y: y };
    }

    public constructor()
    {
        CanvasGrid._smallGridPattern.setAttribute("width", `${CanvasGrid.smallGridSize}`);
        CanvasGrid._smallGridPattern.setAttribute("height", `${CanvasGrid.smallGridSize}`);

        CanvasGrid._bigGridPattern.setAttribute("width", `${CanvasGrid.bigGridSize}`);
        CanvasGrid._bigGridPattern.setAttribute("height", `${CanvasGrid.bigGridSize}`);

        CanvasGrid._smallGridCircle.setAttribute("cx", `${CanvasGrid.smallGridSize / 2}`);
        CanvasGrid._smallGridCircle.setAttribute("cy", `${CanvasGrid.smallGridSize / 2}`);

        CanvasGrid._bigGridCircle.setAttribute("cx", `${CanvasGrid.smallGridSize / 2}`);
        CanvasGrid._bigGridCircle.setAttribute("cy", `${CanvasGrid.smallGridSize / 2}`);

        CanvasGrid._bigGridRect.setAttribute("width", `${CanvasGrid.bigGridSize}`);
        CanvasGrid._bigGridRect.setAttribute("height", `${CanvasGrid.bigGridSize}`);

        this.updateGridSize();
        this.updateGridPosition();

        Settings.instance.addEventListener(Settings.isGridEnabledChangedEvent, () =>
        {
            if (Settings.instance.isGridEnabled)
            {
                this.showGrid();
            }
            else
            {
                this.hideGrid();
            }
        });
    }

    public updateGridSize()
    {
        let zoom = Settings.instance.zoom;

        let size = {
            width: CanvasGrid._canvas.clientWidth / zoom + CanvasGrid.bigGridSize * 2,
            height: CanvasGrid._canvas.clientHeight / zoom + CanvasGrid.bigGridSize * 2,
        };

        CanvasGrid._gridRect.setAttribute("width", `${size.width}`);
        CanvasGrid._gridRect.setAttribute("height", `${size.height}`);

        CanvasGrid._smallGridCircle.setAttribute("r", `${1 / Settings.instance.zoom}`);

        if (Settings.instance.zoom < 0.35)
        {
            CanvasGrid._bigGridRect.classList.add("hidden");

            CanvasGrid._bigGridCircle.setAttribute("r", `${1 / Settings.instance.zoom}`);
        }
        else if (Settings.instance.zoom > 3)
        {
            CanvasGrid._bigGridRect.classList.remove("hidden");

            CanvasGrid._smallGridCircle.setAttribute("r", `${2 / Settings.instance.zoom}`);
            CanvasGrid._bigGridCircle.setAttribute("r", `${4 / Settings.instance.zoom}`);
        }
        else
        {
            CanvasGrid._bigGridRect.classList.remove("hidden");

            CanvasGrid._bigGridCircle.setAttribute("r", `${2 / Settings.instance.zoom}`);
        }
    }

    public updateGridPosition() 
    {
        let offset: Point = {
            x: PanZoomConfiguration.context.getTransform().x / Settings.instance.zoom,
            y: PanZoomConfiguration.context.getTransform().y / Settings.instance.zoom,
        };

        CanvasGrid._gridRect.setAttribute("x", `${-offset.x - CanvasGrid.bigGridSize}`);
        CanvasGrid._gridRect.setAttribute("y", `${-offset.y - CanvasGrid.bigGridSize}`);
    }

    private hideGrid(): void
    {
        CanvasGrid._gridGroup.classList.add("hidden");
    }

    private showGrid(): void
    {
        CanvasGrid._gridGroup.classList.remove("hidden");
    }

    public static readonly smallGridSize = 20;
    public static readonly bigGridSize = 100;

    private static readonly _canvas = document.querySelector("#canvas") as SVGSVGElement;

    private static readonly _gridGroup = document.querySelector("#canvas .grid") as SVGGElement;

    private static readonly _gridRect = document.querySelector("#canvas .grid>rect") as SVGRectElement;
    private static readonly _smallGridPattern = this._gridGroup.querySelector("#small-grid-pattern") as SVGPatternElement;
    private static readonly _bigGridPattern = this._gridGroup.querySelector("#big-grid-pattern") as SVGPatternElement;
    private static readonly _smallGridCircle = this._gridGroup.querySelector("#small-grid-pattern circle") as SVGCircleElement;
    private static readonly _bigGridCircle = this._gridGroup.querySelector("#big-grid-pattern circle") as SVGCircleElement;
    private static readonly _bigGridRect = this._gridGroup.querySelector("#big-grid-pattern>rect") as SVGRectElement;
}
