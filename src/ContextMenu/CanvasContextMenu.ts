import { CustomContextMenu } from "./CustomContextMenu";

export class CanvasContextMenu extends CustomContextMenu
{
    public static readonly createNodeOptionClickedEvent = "create-node-option-clicked";
    public static readonly lockCanvasSwitchClickedEvent = "lock-canvas-switch-clicked";
    public static readonly toggleGridSwitchClickedEvent = "toggle-grid-switch-clicked";
    public static readonly cancelLinkingOptionClickedEvent = "cancel-linking-option-clicked";
    public static readonly showHelpOptionClickedEvent = "show-help-option-clicked";

    public constructor(ownerNode: HTMLElement | SVGElement)
    {
        super(ownerNode, "canvas");

        this._lockCanvasSwitch =
            document.querySelector(`#${this.containerId} #lock-canvas-switch`) as HTMLDivElement;
        this._createNodeOption =
            document.querySelector(`#${this.containerId} #create-node-option`) as HTMLDivElement;
        this._toggleGridSwitch =
            document.querySelector(`#${this.containerId} #toggle-grid-switch`) as HTMLDivElement;
        this._cancelLinkingOption =
            document.querySelector(`#${this.containerId} #cancel-linking-option`) as HTMLDivElement;
        this._showHelpOption =
            document.querySelector(`#${this.containerId} #show-help-option`) as HTMLDivElement;

        this.setupMenuOption(this._createNodeOption, CanvasContextMenu.createNodeOptionClickedEvent);
        this.setupMenuOption(this._lockCanvasSwitch, CanvasContextMenu.lockCanvasSwitchClickedEvent);
        this.setupMenuOption(this._toggleGridSwitch, CanvasContextMenu.toggleGridSwitchClickedEvent);
        this.setupMenuOption(this._cancelLinkingOption, CanvasContextMenu.cancelLinkingOptionClickedEvent);
        this.setupMenuOption(this._showHelpOption, CanvasContextMenu.showHelpOptionClickedEvent);
    }

    public setCanvasLockedSwitchState(enabled: boolean)
    {
        CustomContextMenu.setSwitchState(this._lockCanvasSwitch, enabled);
    }

    public setGridSwitchState(enabled: boolean)
    {
        CustomContextMenu.setSwitchState(this._toggleGridSwitch, enabled);
    }

    private _lockCanvasSwitch: HTMLDivElement;
    private _createNodeOption: HTMLDivElement;
    private _toggleGridSwitch: HTMLDivElement;
    private _cancelLinkingOption: HTMLDivElement;
    private _showHelpOption: HTMLDivElement;
}
