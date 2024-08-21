import { CustomContextMenu } from "./CustomContextMenu";

export class NodeContextMenu extends CustomContextMenu
{
    public static readonly deleteNodeOptionClickedEvent = "delete-node-option-clicked";
    public static readonly configureNodeOptionClickedEvent = "configure-node-option-clicked";

    public constructor(ownerNode: HTMLElement | SVGElement)
    {
        super(ownerNode, "node");

        this._deleteNodeOption =
            document.querySelector(`#${this.containerId} #delete-node-option`) as HTMLDivElement;

        this.setupMenuOption(this._deleteNodeOption, NodeContextMenu.deleteNodeOptionClickedEvent);

        this._configureNodeOption =
            document.querySelector(`#${this.containerId} #configure-node-option`) as HTMLDivElement;

        this.setupMenuOption(this._configureNodeOption, NodeContextMenu.configureNodeOptionClickedEvent);
    }

    private _deleteNodeOption: HTMLDivElement;
    private _configureNodeOption: HTMLDivElement;
}
