import { PanZoomConfiguration } from "./PanZoomConfiguration";

export class Settings extends EventTarget
{
    public static readonly isCanvasLockedChangedEvent = "canvas-locked-changed";
    public static readonly zoomChangedEvent = "canvas-locked-changed";

    public static get instance()
    {
        return this._instance;
    }

    public get isCanvasLocked(): boolean
    {
        return this._isCanvasLocked;
    }

    public set isCanvasLocked(canvasLocked: boolean)
    {
        if (canvasLocked)
        {
            PanZoomConfiguration.context.pause();
        }
        else
        {
            PanZoomConfiguration.context.resume();
        }

        this._isCanvasLocked = canvasLocked;

        this.dispatchEvent(new Event(Settings.isCanvasLockedChangedEvent));
    }

    public get zoom(): number
    {
        return this._zoom;
    }

    public set zoom(value: number)
    {
        this._zoom = value;

        this.dispatchEvent(new Event(Settings.zoomChangedEvent));
    }

    private constructor()
    {
        super();
    }

    private static readonly _instance = new Settings();

    private _isCanvasLocked = false;
    private _zoom = 0;
}
