import panzoom, { PanZoom } from "panzoom";
import { Point } from "./Geometry/Point";

export class PanZoomConfiguration
{
    public static configurePanContext(viewport: SVGElement, canvas: SVGElement)
    {
        this._panContext = panzoom(viewport, {
            zoomDoubleClickSpeed: 1, // disables double click zoom
            beforeMouseDown: () =>
            {
                let shouldIgnore = !this._isPanning;
                return shouldIgnore;
            },
            beforeWheel: (event) => 
            {
                event.preventDefault();
                let shouldIgnore = !this._isZooming;
                return shouldIgnore;
            },
        });

        canvas.addEventListener("wheel", (event) =>
        {
            let scrollDelta: Point = { x: event.deltaX, y: event.deltaY };

            // Horizontal scroll for keyboards.
            if (scrollDelta.x === 0 && event.shiftKey)
            {
                scrollDelta.x = scrollDelta.y;
                scrollDelta.y = 0;
            }

            if (!this._isZooming)
            {
                this.context.moveTo(
                    this.context.getTransform().x - scrollDelta.x,
                    this.context.getTransform().y - scrollDelta.y,
                );
            }
        }, { passive: true });

        window.addEventListener("focusout", () =>
        {
            this.stopPanning();
            this.stopZooming();
        });
    }

    public static setPanningButtons(requiredCodes: string[], requiredKeys: string[])
    {
        window.addEventListener("keydown", (event) =>
        {
            if (event.repeat) { return; }

            let anyCodeDown = requiredCodes.includes(event.code);
            let anyKeyDown = requiredKeys.includes(event.key);

            if (anyCodeDown || anyKeyDown)
            {
                event.preventDefault();

                this.startPanning();
            }
        });

        window.addEventListener("keyup", (event) =>
        {
            if (event.repeat) { return; }

            let anyCodeUp = requiredCodes.includes(event.code);
            let anyKeyUp = requiredKeys.includes(event.key);

            if (anyCodeUp || anyKeyUp)
            {
                event.preventDefault();

                this.stopPanning();
            }
        });
    }

    public static setZoomingButtons(requiredCodes: string[], requiredKeys: string[])
    {
        window.addEventListener("keydown", (event) =>
        {
            if (event.repeat) { return; }

            let anyCodeDown = requiredCodes.includes(event.code);
            let anyKeyDown = requiredKeys.includes(event.key);

            if (anyCodeDown || anyKeyDown)
            {
                event.preventDefault();

                this.startZooming();
            }
        });

        window.addEventListener("keyup", (event) =>
        {
            if (event.repeat) { return; }

            let anyCodeUp = requiredCodes.includes(event.code);
            let anyKeyUp = requiredKeys.includes(event.key);

            if (anyCodeUp || anyKeyUp)
            {
                event.preventDefault();

                this.stopZooming();
            }
        });
    }

    public static get context()
    {
        if (this._panContext == undefined)
        {
            throw Error("Pan context is not defined");
        }

        return this._panContext;
    }

    public static get isPanning()
    {
        return this._isPanning;
    }

    public static get isZooming()
    {
        return this._isZooming;
    }

    private static startPanning()
    {
        this._isPanning = true;

        this._container.classList.add("move");
    }

    private static stopPanning()
    {
        this._isPanning = false;

        this._container.classList.remove("move");
    }

    private static startZooming()
    {
        this._isZooming = true;
    }

    private static stopZooming()
    {
        this._isZooming = false;
    }

    private constructor() { }

    private static _panContext?: PanZoom;

    private static _isPanning = false;
    private static _isZooming = false;

    private static _container = document.querySelector("#container") as HTMLDivElement;
}
