import { CustomContextMenu } from "./CustomContextMenu";

export class CanvasContextMenu extends CustomContextMenu
{
    public static readonly createNodeOptionClickedEvent = "create-node-option-clicked";
    public static readonly lockCanvasSwitchClickedEvent = "lock-canvas-switch-clicked";

    public constructor(ownerNode: HTMLElement | SVGElement)
    {
        super(ownerNode, "canvas");

        this._lockCanvasSwitch =
            document.querySelector(`#${this.containerId} #lock-canvas-switch`) as HTMLDivElement;
        this._createNodeOption =
            document.querySelector(`#${this.containerId} #create-node-option`) as HTMLDivElement;

        this.setupMenuOption(this._createNodeOption, CanvasContextMenu.createNodeOptionClickedEvent);
        this.setupMenuOption(this._lockCanvasSwitch, CanvasContextMenu.lockCanvasSwitchClickedEvent);
    }

    public setCanvasLockedSwitchState(enabled: boolean)
    {
        CustomContextMenu.setSwitchState(this._lockCanvasSwitch, enabled);
    }

    private _lockCanvasSwitch: HTMLDivElement;
    private _createNodeOption: HTMLDivElement;
}
