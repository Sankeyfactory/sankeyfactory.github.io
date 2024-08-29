import { SankeyNode } from "./Sankey/SankeyNode";
import { Point } from "./Geometry/Point";
import { MouseHandler } from "./MouseHandler";
import { GameRecipe } from "./GameData/GameRecipe";
import { GameMachine } from "./GameData/GameMachine";
import { Settings } from "./Settings";
import { CanvasContextMenu } from "./ContextMenu/CanvasContextMenu";
import { ResourcesSummary } from "./ResourcesSummary";
import { PanZoomConfiguration } from "./PanZoomConfiguration";
import { SvgIcons } from './SVG/SvgIcons';
import { HelpModal } from './HelpWindow/HelpModal';
import { RecipeSelectionModal } from './RecipeSelectionModal';

async function main()
{
    SvgIcons.replaceAllPlaceholders();

    let zoomRatioDisplay = document.querySelector("p#ratio-display") as HTMLParagraphElement;
    let canvas = document.querySelector("#canvas") as SVGElement;

    let _helpModal = new HelpModal();

    PanZoomConfiguration.setPanningButtons(["Space"], ["Meta"]);
    PanZoomConfiguration.setZoomingButtons([], ["Control"]);
    PanZoomConfiguration.configurePanContext(canvas);

    Settings.instance.addEventListener(Settings.zoomChangedEvent, () =>
    {
        zoomRatioDisplay.textContent = `Zoom: ${Settings.instance.zoom.toFixed(2)}x`;
    });

    let resourcesSummary = new ResourcesSummary();

    let recipeSelectionModal = new RecipeSelectionModal();
    let nodeCreationPosition: Point;

    function createNode(recipe: GameRecipe, machine: GameMachine)
    {
        const node = new SankeyNode(nodeCreationPosition, recipe, machine);

        node.nodeSvg.onmousedown = (event) =>
        {
            if (event.buttons === 1
                && !PanZoomConfiguration.isPanning
                && !PanZoomConfiguration.isZooming)
            {
                MouseHandler.getInstance().startDraggingNode(
                    node,
                    { x: event.clientX, y: event.clientY }
                );
            }
        };

        node.nodeSvg.addEventListener("touchstart", (event) =>
        {
            if (event.touches.length === 1 && Settings.instance.isCanvasLocked)
            {
                let touch = event.touches[0];

                MouseHandler.getInstance().startDraggingNode(
                    node,
                    { x: touch.clientX, y: touch.clientY }
                );
            }
        });

        resourcesSummary.registerNode(node);
    };

    recipeSelectionModal.addEventListener(RecipeSelectionModal.recipeConfirmedEvent, () =>
    {
        let recipe = recipeSelectionModal.selectedRecipe!;

        createNode(recipe.recipe, recipe.madeIn);
    });

    function openNodeCreation(nodePosition?: Point)
    {
        let pageCenter = {
            x: document.documentElement.clientWidth / 2,
            y: document.documentElement.clientHeight / 2
        };

        nodeCreationPosition = nodePosition ?? MouseHandler.clientToCanvasPosition(pageCenter);

        recipeSelectionModal.openModal();
    }

    (document.querySelector("div.button#create-node") as HTMLDivElement).onclick = () =>
    {
        openNodeCreation();
    };

    (document.querySelector("div.button#cancel-linking") as HTMLDivElement).onclick = () =>
    {
        MouseHandler.getInstance().cancelConnectingSlots();
    };

    let lockButton = document.querySelector("div.button#lock-viewport") as HTMLDivElement;
    let unlockedIcon = document.querySelector("div.button#lock-viewport>svg.unlocked") as SVGElement;
    let lockedIcon = document.querySelector("div.button#lock-viewport>svg.locked") as SVGElement;

    lockButton.onclick = () =>
    {
        Settings.instance.isCanvasLocked = !Settings.instance.isCanvasLocked;
    };

    Settings.instance.addEventListener(Settings.isCanvasLockedChangedEvent, () =>
    {
        if (Settings.instance.isCanvasLocked)
        {
            unlockedIcon.classList.add("hidden");
            lockedIcon.classList.remove("hidden");
        }
        else
        {
            unlockedIcon.classList.remove("hidden");
            lockedIcon.classList.add("hidden");
        }
    });

    window.addEventListener("keydown", (event) =>
    {
        if (event.repeat) { return; }

        if (event.key === "Escape")
        {
            event.preventDefault();
            MouseHandler.getInstance().cancelConnectingSlots();
        }
    });

    let canvasContextMenu = new CanvasContextMenu(canvas);

    canvasContextMenu.addEventListener(CanvasContextMenu.createNodeOptionClickedEvent, () =>
    {
        let contextMenuPos = canvasContextMenu.openingPosition;

        if (contextMenuPos != undefined)
        {
            contextMenuPos = MouseHandler.clientToCanvasPosition(contextMenuPos);
        }

        openNodeCreation(contextMenuPos);
    });

    canvas.addEventListener("dblclick", (event) =>
    {
        let nodePosition = { x: event.clientX, y: event.clientY };
        openNodeCreation(MouseHandler.clientToCanvasPosition(nodePosition));
    });

    canvasContextMenu.addEventListener(CanvasContextMenu.lockCanvasSwitchClickedEvent, () =>
    {
        Settings.instance.isCanvasLocked = !Settings.instance.isCanvasLocked;
    });

    Settings.instance.addEventListener(Settings.isCanvasLockedChangedEvent, () =>
    {
        canvasContextMenu.setCanvasLockedSwitchState(Settings.instance.isCanvasLocked);
    });

    window.addEventListener("keypress", (event) =>
    {
        let anyOverlayOpened = false; // Modal window or context menu.

        document.querySelectorAll(".modal-window-container").forEach((modal) =>
        {
            if (!modal.classList.contains("hidden"))
            {
                anyOverlayOpened = true;
            }
        });

        document.querySelectorAll(".context-menu-container").forEach((modal) =>
        {
            if (!modal.classList.contains("hidden"))
            {
                anyOverlayOpened = true;
            }
        });

        if (event.code === "KeyN" && !anyOverlayOpened)
        {
            openNodeCreation();
        }

        if (event.code === "KeyL")
        {
            Settings.instance.isCanvasLocked = !Settings.instance.isCanvasLocked;
        }
    });

    window.onmouseup = () =>
    {
        MouseHandler.getInstance().handleMouseUp();
    };

    window.addEventListener("touchend", () =>
    {
        MouseHandler.getInstance().handleMouseUp();
    });

    window.onmousemove = (event) =>
    {
        MouseHandler.getInstance().handleMouseMove(event);
    };

    window.addEventListener("touchmove", (event) =>
    {
        MouseHandler.getInstance().handleTouchMove(event);
    });
}

main().catch((reason) =>
{
    console.error(reason);
});
