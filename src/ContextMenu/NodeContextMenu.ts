import { CustomContextMenu } from "./CustomContextMenu";

export class NodeContextMenu extends CustomContextMenu
{
    public static readonly deleteNodeOptionClickedEvent = "delete-node-option-clicked";

    public constructor(ownerNode: HTMLElement | SVGElement)
    {
        super(ownerNode, "node");

        this._deleteNodeOption =
            document.querySelector(`#${this.containerId} #delete-node-option`) as HTMLDivElement;

        this.setupMenuOption(this._deleteNodeOption, NodeContextMenu.deleteNodeOptionClickedEvent);
    }

    private _deleteNodeOption: HTMLDivElement;
}
