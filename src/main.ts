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
import { CanvasGrid } from "./CanvasGrid";
import { AppData } from "./AppData";

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

    function createNode(recipe: GameRecipe, machine: GameMachine)
    {
        const node = new SankeyNode(nodeCreationPosition, recipe, machine);

        registerNode(node);

        AppData.addNode(node);
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

    lockButton.onclick = () =>
    {
        Settings.instance.isCanvasLocked = !Settings.instance.isCanvasLocked;
    };

    Settings.instance.addEventListener(Settings.isCanvasLockedChangedEvent, () =>
    {
        if (Settings.instance.isCanvasLocked)
        {
            lockButton.classList.add("on");
            lockButton.classList.remove("off");
        }
        else
        {
            lockButton.classList.remove("on");
            lockButton.classList.add("off");
        }
    });

    let gridToggle = document.querySelector("#container div.controls #grid-toggle") as HTMLDivElement;

    gridToggle.onclick = () =>
    {
        Settings.instance.isGridEnabled = !Settings.instance.isGridEnabled;
    };

    Settings.instance.addEventListener(Settings.isGridEnabledChangedEvent, () =>
    {
        if (Settings.instance.isGridEnabled)
        {
            gridToggle.classList.add("on");
            gridToggle.classList.remove("off");
        }
        else
        {
            gridToggle.classList.remove("on");
            gridToggle.classList.add("off");
        }
    });

    function loadFromUrl()
    {
        let dataEncoded = location.hash.slice(1);
        if (dataEncoded == ``) return;

        let dataCompressedString = atob(decodeURI(dataEncoded));
        let dataCompressed: number[] = [];
        for (let i = 0; i < dataCompressedString.length; ++i)
        {
            dataCompressed.push(dataCompressedString.charCodeAt(i));
        }
        let dataStream = new Blob([new Uint8Array(dataCompressed)]).stream().pipeThrough(new DecompressionStream(`deflate`));

        new Response(dataStream).text().then(savedData =>
        {
            AppData.deserialize(savedData);

            for (const node of AppData.nodes)
            {
                registerNode(node);
            }
        });
    }

    window.addEventListener("keydown", (event) =>
    {
        if (event.repeat) { return; }

        if (event.key === "Escape")
        {
            event.preventDefault();
            MouseHandler.getInstance().cancelConnectingSlots();
        }

        if (event.code === "KeyS")
        {
            if (AppData.nodes.length === 0)
            {
                location.hash = "";
                return;
            }

            let savedData = AppData.serialize();

            let dataCompressedStream = new Blob([savedData]).stream().pipeThrough(new CompressionStream(`deflate`));

            new Response(dataCompressedStream).arrayBuffer().then((dataCompressed) =>
            {
                let dataEncoded = encodeURI(btoa(String.fromCharCode(...new Uint8Array(dataCompressed))));

                location.hash = dataEncoded;
            });
        }

        if (event.code === "KeyR")
        {
            loadFromUrl();
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

    loadFromUrl();
}

main().catch((reason) =>
{
    console.error(reason);
});
