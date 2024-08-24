import { Point } from "../Geometry/Point";

export abstract class CustomContextMenu extends EventTarget
{
    /** 
     * @param name is used to deduce html element id: `${name}-context-menu-container`
     */
    public constructor(ownerNode: HTMLElement | SVGElement, name: string)
    {
        super();

        this._menuContainer = document.querySelector(`#${name}-context-menu-container`)!;

        this._menuContainer.addEventListener("mousedown", () =>
        {
            this.closeMenu();
        });

        this.addMenuTo(ownerNode);
    }

    public openMenu(): void
    {
        this._isMenuOpened = true;

        this._menuContainer.classList.remove("hidden");
    }

    public closeMenu(): void
    {
        this._isMenuOpened = false;

        this._menuContainer.classList.add("hidden");
    }

    public addMenuTo(node: HTMLElement | SVGElement): void
    {
        let contextMenu =
            document.querySelector(`#${this.containerId}>.context-menu`) as HTMLDivElement;

        node.addEventListener("contextmenu", (event) =>
        {
            let mouseEvent = event as MouseEvent;

            event.preventDefault();

            this._openingPosition = { x: mouseEvent.clientX, y: mouseEvent.clientY };

            contextMenu.style.top = `${mouseEvent.pageY + 5}px`;
            contextMenu.style.left = `${mouseEvent.pageX + 5}px`;

            this.openMenu();

            event.stopPropagation();
        });
    }

    public get isMenuOpened(): boolean
    {
        return this._isMenuOpened;
    }

    public get openingPosition(): Point | undefined
    {
        return this._openingPosition;
    }

    protected get containerId(): string
    {
        return this._menuContainer.id;
    }

    protected setupMenuOption(optionNode: HTMLElement, eventName: string)
    {
        optionNode.addEventListener("mousedown", (event) =>
        {
            event.stopPropagation();
        });

        optionNode.addEventListener("click", () =>
        {
            // Checking this ensures that the event of the correct instance is called.
            if (this._isMenuOpened)
            {
                this.dispatchEvent(new Event(eventName));

                this.closeMenu();
            }
        });
    }

    protected static setSwitchState(switchNode: HTMLElement, enabled: boolean)
    {
        if (enabled)
        {
            switchNode.classList.add("enabled");
        }
        else
        {
            switchNode.classList.remove("enabled");
        }
    }

    private _menuContainer: HTMLDivElement;

    private _isMenuOpened = false;
    private _openingPosition?: Point;
} 