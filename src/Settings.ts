import { PanZoom } from "panzoom";

export class Settings extends EventTarget
{
    public static readonly isCanvasLockedChangedEvent = "canvas-locked-changed";

    public static get instance()
    {
        return this._instance;
    }

    public setPanContext(panContext: PanZoom): void
    {
        this._panContext = panContext;
    }

    public get isCanvasLocked(): boolean
    {
        return this._isCanvasLocked;
    }

    public set isCanvasLocked(canvasLocked: boolean)
    {
        if (this._panContext == undefined)
        {
            throw Error("Pan context must be initialized before locking canvas");
        }

        if (canvasLocked)
        {
            this._panContext.pause();
        }
        else
        {
            this._panContext.resume();
        }

        this._isCanvasLocked = canvasLocked;

        this.dispatchEvent(new Event(Settings.isCanvasLockedChangedEvent));
    }

    private constructor()
    {
        super();
    }

    private static readonly _instance = new Settings();

    private _panContext?: PanZoom;

    private _isCanvasLocked = false;
}
