import { PanZoomConfiguration } from "./PanZoomConfiguration";

export class Settings extends EventTarget
{
    public static readonly isCanvasLockedChangedEvent = "canvas-locked-changed";
    public static readonly isGridEnabledChangedEvent = "grid-enabled-changed";
    public static readonly zoomChangedEvent = "canvas-locked-changed";
    public static readonly connectingResourceIdChangedEvent = "connecting-resource-id-changed";

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

    public get isGridEnabled(): boolean
    {
        return this._isGridEnabled;
    }

    public set isGridEnabled(value: boolean)
    {
        this._isGridEnabled = value;

        this.dispatchEvent(new Event(Settings.isGridEnabledChangedEvent));
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

    public get connectingResource(): Settings.ConnectingResource | undefined
    {
        return this._connectingResource;
    }

    public set connectingResource(value: Settings.ConnectingResource | undefined)
    {
        this._connectingResource = value;

        this.dispatchEvent(new Event(Settings.connectingResourceIdChangedEvent));
    }

    private constructor()
    {
        super();
    }

    private static readonly _instance = new Settings();

    private _isCanvasLocked = false;
    private _isGridEnabled = false;
    private _zoom = 1;
    private _connectingResource?: Settings.ConnectingResource;
}

export namespace Settings
{
    export type ConnectingResource = { type: "input" | "output", id: string; };
}
