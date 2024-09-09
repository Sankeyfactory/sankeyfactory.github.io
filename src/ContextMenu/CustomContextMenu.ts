import { HtmlUtils } from "../DomUtils/HtmlUtils";
import { Point } from "../Geometry/Point";

export abstract class CustomContextMenu extends EventTarget
{
    public static readonly menuOpenedEvent = "menu-opened";
    public static readonly menuClosedEvent = "menu-closed";

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

        window.addEventListener("keydown", (event) =>
        {
            if (event.code === "Escape" && this._isMenuOpened)
            {
                event.preventDefault();
                event.stopPropagation();

                this.closeMenu();
            }
        });

        this.addMenuTo(ownerNode);
    }

    public openMenu(): void
    {
        this._isMenuOpened = true;

        this._menuContainer.classList.remove("hidden");

        this.dispatchEvent(new Event(CustomContextMenu.menuOpenedEvent));
    }

    public closeMenu(): void
    {
        this._isMenuOpened = false;

        this._menuContainer.classList.add("hidden");

        this.dispatchEvent(new Event(CustomContextMenu.menuClosedEvent));
    }

    public addMenuTo(element: HTMLElement | SVGElement): void
    {
        let contextMenu =
            document.querySelector(`#${this.containerId}>.context-menu`) as HTMLDivElement;

        element.addEventListener("contextmenu", (event) =>
        {
            let mouseEvent = event as MouseEvent;

            event.preventDefault();

            this._openingPosition = { x: mouseEvent.clientX, y: mouseEvent.clientY };

            contextMenu.style.top = `${mouseEvent.pageY + 5}px`;
            contextMenu.style.left = `${mouseEvent.pageX + 5}px`;

            this.openMenu();

            event.stopPropagation();
        });

        this.addEventListener(CustomContextMenu.menuOpenedEvent, function ()
        {
            element.classList.add("selected");
        });

        this.addEventListener(CustomContextMenu.menuClosedEvent, function ()
        {
            element.classList.remove("selected");
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
        HtmlUtils.toggleClass(switchNode, "enabled", enabled);
    }

    private _menuContainer: HTMLDivElement;

    private _isMenuOpened = false;
    private _openingPosition?: Point;
} 
