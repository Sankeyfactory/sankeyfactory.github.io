import { Point } from "./Point";

export class CanvasContextMenu extends EventTarget
{
    public static readonly createNodeOptionClickedEvent = "create-node-option-clicked";
    public static readonly lockCanvasSwitchClickedEvent = "lock-canvas-switch-clicked";

    public constructor()
    {
        super();

        this._menuContainer.addEventListener("mousedown", () =>
        {
            this.closeMenu();
        });

        this.setupMenuOption(this._createNodeOption, CanvasContextMenu.createNodeOptionClickedEvent);
        this.setupMenuOption(this._lockCanvasSwitch, CanvasContextMenu.lockCanvasSwitchClickedEvent);
    }

    public addMenuTo(node: HTMLElement | SVGElement): void
    {
        let canvasContextMenu =
            document.querySelector("#canvas-context-menu-container>.context-menu") as HTMLDivElement;

        node.addEventListener("contextmenu", (event) =>
        {
            let mouseEvent = event as MouseEvent;

            event.preventDefault();

            this._openingPosition = { x: mouseEvent.clientX, y: mouseEvent.clientY };

            canvasContextMenu.style.top = `${mouseEvent.pageY + 5}px`;
            canvasContextMenu.style.left = `${mouseEvent.pageX + 5}px`;

            this.openMenu();
        });
    }

    public closeMenu(): void
    {
        this._isMenuOpened = false;

        this._menuContainer.classList.add("hidden");
    }

    public openMenu(): void
    {
        this._isMenuOpened = true;

        this._menuContainer.classList.remove("hidden");
    }

    public get isMenuOpened(): boolean
    {
        return this._isMenuOpened;
    }

    public get openingPosition(): Point | undefined
    {
        return this._openingPosition;
    }

    public setCanvasLockedSwitchEnabled(canvasLocked: boolean)
    {
        if (canvasLocked)
        {
            this._lockCanvasSwitch.classList.add("enabled");
        }
        else
        {
            this._lockCanvasSwitch.classList.remove("enabled");
        }
    }

    private setupMenuOption(optionNode: HTMLElement, eventName: string)
    {
        optionNode.addEventListener("mousedown", (event) =>
        {
            event.stopPropagation();
        });

        optionNode.addEventListener("click", () =>
        {
            this.dispatchEvent(new Event(eventName));

            this._menuContainer.classList.add("hidden");
            this._isMenuOpened = false;
        });
    }

    private _menuContainer = document.querySelector("#canvas-context-menu-container") as HTMLDivElement;
    private _lockCanvasSwitch = document.querySelector("#lock-canvas-switch") as HTMLDivElement;
    private _createNodeOption = document.querySelector("#create-node-option") as HTMLDivElement;

    private _isMenuOpened = false;
    private _openingPosition?: Point;
}
