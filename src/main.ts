import { SankeyNode } from "./Sankey/SankeyNode";
import { Point } from "./Geometry/Point";
import { MouseHandler } from "./MouseHandler";
import { GameRecipe } from "./GameData/GameRecipe";
import { GameMachine } from "./GameData/GameMachine";
import { Settings } from "./Settings";
import { CanvasContextMenu } from "./ContextMenu/CanvasContextMenu";
import { ResourcesSummary } from "./ResourcesSummary";
import { PanZoomConfiguration } from "./PanZoomConfiguration";
import { SvgIcons } from './DomUtils/SvgIcons';
import { HelpModal } from './HelpWindow/HelpModal';
import { RecipeSelectionModal } from './RecipeSelectionModal';
import { CanvasGrid } from "./CanvasGrid";
import { AppData } from "./DataSaves/AppData";
import { loadSatisfactoryResource, loadSingleSatisfactoryRecipe } from "./GameData/GameData";
import { SankeyLink } from "./Sankey/SankeyLink";
import { SlotsGroup } from "./Sankey/SlotsGroup";
import { SavesLoaderMenu } from "./DataSaves/SavesLoaderMenu";
import { HtmlUtils } from "./DomUtils/HtmlUtils";

async function main()
{
    SvgIcons.replaceAllPlaceholders();

    let zoomRatioDisplay = document.querySelector("p#ratio-display") as HTMLParagraphElement;
    let canvas = document.querySelector("#canvas") as SVGElement;

    let helpModal = new HelpModal();

    PanZoomConfiguration.setPanningButtons(["Space"], ["Meta"]);
    PanZoomConfiguration.setZoomingButtons([], ["Control"]);
    PanZoomConfiguration.configurePanContext(canvas);

    let canvasGrid = new CanvasGrid();

    zoomRatioDisplay.textContent = `Zoom: ${Settings.instance.zoom.toFixed(2)}x`;

    Settings.instance.addEventListener(Settings.zoomChangedEvent, () =>
    {
        zoomRatioDisplay.textContent = `Zoom: ${Settings.instance.zoom.toFixed(2)}x`;

        canvasGrid.updateGridSize();
        canvasGrid.updateGridPosition();
    });

    PanZoomConfiguration.context.on("pan", () =>
    {
        canvasGrid.updateGridPosition();
    });

    let resourcesSummary = new ResourcesSummary();

    let recipeSelectionModal = new RecipeSelectionModal();
    let nodeCreationPosition: Point;

    let registerNode = (node: SankeyNode) =>
    {
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

    let onceNodeCreated: ((node: SankeyNode) => void) | undefined;

    function createNode(recipe: GameRecipe, machine: GameMachine): SankeyNode
    {
        const node = new SankeyNode(nodeCreationPosition, recipe, machine);

        registerNode(node);

        AppData.instance.addNode(node);

        if (onceNodeCreated != undefined)
        {
            onceNodeCreated(node);
            onceNodeCreated = undefined;
        }

        return node;
    };

    recipeSelectionModal.addEventListener(RecipeSelectionModal.recipeConfirmedEvent, () =>
    {
        let recipe = recipeSelectionModal.selectedRecipe!;

        createNode(recipe.recipe, recipe.madeIn);
    });

    recipeSelectionModal.addEventListener(RecipeSelectionModal.modalClosedEvent, () =>
    {
        onceNodeCreated = undefined;
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

    let requestClearCanvas = () =>
    {
        if (confirm(
            "Are you sure that you want to clear canvas?\n"
            + "This will delete all nodes and connections.\n"
            + "Save the page link if you don't want to lose the data."))
        {
            AppData.instance.deleteAllNodes();

            AppData.instance.save();
        }
    };

    (document.querySelector("div.button#clear-canvas") as HTMLDivElement).onclick = () =>
    {
        requestClearCanvas();
    };

    let lockButton = document.querySelector("div.button#lock-viewport") as HTMLDivElement;

    lockButton.onclick = () =>
    {
        Settings.instance.isCanvasLocked = !Settings.instance.isCanvasLocked;
    };

    Settings.instance.addEventListener(Settings.isCanvasLockedChangedEvent, () =>
    {
        HtmlUtils.toggleClass(lockButton, "on", Settings.instance.isCanvasLocked);
        HtmlUtils.toggleClass(lockButton, "off", !Settings.instance.isCanvasLocked);
    });

    let gridToggle = document.querySelector("#container div.controls #grid-toggle") as HTMLDivElement;

    gridToggle.onclick = () =>
    {
        Settings.instance.isGridEnabled = !Settings.instance.isGridEnabled;
    };

    Settings.instance.addEventListener(Settings.isGridEnabledChangedEvent, () =>
    {
        HtmlUtils.toggleClass(gridToggle, "on", Settings.instance.isGridEnabled);
        HtmlUtils.toggleClass(gridToggle, "off", !Settings.instance.isGridEnabled);
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

    canvas.addEventListener("dblclick", (event) =>
    {
        let nodePosition = { x: event.clientX, y: event.clientY };
        openNodeCreation(MouseHandler.clientToCanvasPosition(nodePosition));
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

    canvasContextMenu.addEventListener(CanvasContextMenu.cancelLinkingOptionClickedEvent, () =>
    {
        MouseHandler.getInstance().cancelConnectingSlots();
    });

    canvasContextMenu.addEventListener(CanvasContextMenu.showHelpOptionClickedEvent, () =>
    {
        helpModal.openModal();
    });

    canvasContextMenu.addEventListener(CanvasContextMenu.lockCanvasSwitchClickedEvent, () =>
    {
        Settings.instance.isCanvasLocked = !Settings.instance.isCanvasLocked;
    });

    Settings.instance.addEventListener(Settings.isCanvasLockedChangedEvent, () =>
    {
        canvasContextMenu.setCanvasLockedSwitchState(Settings.instance.isCanvasLocked);
    });

    canvasContextMenu.addEventListener(CanvasContextMenu.toggleGridSwitchClickedEvent, () =>
    {
        Settings.instance.isGridEnabled = !Settings.instance.isGridEnabled;
    });

    Settings.instance.addEventListener(Settings.isGridEnabledChangedEvent, () =>
    {
        canvasContextMenu.setGridSwitchState(Settings.instance.isGridEnabled);
    });

    canvasContextMenu.addEventListener(CanvasContextMenu.clearCanvasOptionClickedEvent, () =>
    {
        requestClearCanvas();
    });

    canvasContextMenu.addEventListener(CanvasContextMenu.nodeFromLinkOptionClickedEvent, () =>
    {
        let slot = MouseHandler.getInstance().firstConnectingSlot;

        if (slot == undefined)
        {
            return;
        }

        let contextMenuPos = canvasContextMenu.openingPosition;

        if (contextMenuPos == undefined)
        {
            throw Error("Context menu position undefined");
        }

        contextMenuPos = MouseHandler.clientToCanvasPosition(contextMenuPos);

        let type: "input" | "output";

        if (MouseHandler.getInstance().mouseStatus === MouseHandler.MouseStatus.ConnectingInputSlot)
        {
            type = "output";
        }
        else if (MouseHandler.getInstance().mouseStatus === MouseHandler.MouseStatus.ConnectingOutputSlot)
        {
            type = "input";
        }
        else
        {
            return;
        }

        nodeCreationPosition = contextMenuPos;

        let suitableRecipe = loadSingleSatisfactoryRecipe({ id: slot.resourceId, type: type });

        onceNodeCreated = (node: SankeyNode) =>
        {
            let resourcesAmount = slot.resourcesAmount;

            let group: SlotsGroup | undefined;

            if (type === "input")
            {
                group = node.inputSlotGroups.find(group => group.resourceId === slot.resourceId);
            }
            else
            {
                group = node.outputSlotGroups.find(group => group.resourceId === slot.resourceId);
            }

            if (group == undefined)
            {
                return;
            }

            let resourcesMultiplier = resourcesAmount / group.resourcesAmount;

            node.machinesAmount = resourcesMultiplier;

            let newSlot1 = slot.splitOffSlot(resourcesAmount);

            if (type === "input")
            {
                let newSlot2 = node.addInputSlot(slot.resourceId, resourcesAmount);
                SankeyLink.connect(newSlot1, newSlot2);
            }
            else
            {
                let newSlot2 = node.addOutputSlot(slot.resourceId, resourcesAmount);
                SankeyLink.connect(newSlot1, newSlot2);
            }
        };

        if (suitableRecipe != undefined)
        {
            createNode(suitableRecipe.recipe, suitableRecipe.machine);
        }
        else
        {
            recipeSelectionModal.openWithSearch(
                loadSatisfactoryResource(slot.resourceId).displayName,
                {
                    ingredients: type === "input",
                    products: type === "output",
                    recipeNames: false,
                    exactMatch: true,
                }
            );
        }

        MouseHandler.getInstance().cancelConnectingSlots();
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

    window.addEventListener("mouseup", () => MouseHandler.getInstance().handleMouseUp());
    window.addEventListener("touchend", () => MouseHandler.getInstance().handleMouseUp());
    window.addEventListener("mousemove", e => MouseHandler.getInstance().handleMouseMove(e));
    window.addEventListener("touchmove", e => MouseHandler.getInstance().handleTouchMove(e));

    AppData.instance.addEventListener(AppData.dataLoadedEvent, () =>
    {
        for (const node of AppData.instance.nodes)
        {
            registerNode(node);
        }
    });

    AppData.instance.loadFromUrl();

    let _savesLoaderMenu = new SavesLoaderMenu();
}

main().catch((reason) =>
{
    console.error(reason);
});
