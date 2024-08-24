import { CustomContextMenu } from "./CustomContextMenu";

export class LinkContextMenu extends CustomContextMenu
{
    public static readonly deleteLinkOptionClickedEvent = "delete-node-option-clicked";

    public constructor(ownerNode: HTMLElement | SVGElement)
    {
        super(ownerNode, "link");

        this._deleteLinkOption =
            document.querySelector(`#${this.containerId} #delete-link-option`) as HTMLDivElement;

        this.setupMenuOption(this._deleteLinkOption, LinkContextMenu.deleteLinkOptionClickedEvent);
    }

    private _deleteLinkOption: HTMLDivElement;
}
