// Ignore import error as the file only appears on launch of the exporting tool.
// @ts-ignore
import satisfactoryData from '../dist/GameData/Satisfactory.json';

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
import { SankeyLink } from './Sankey/SankeyLink';

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

    let nodes: SankeyNode[] = [];
    let nodeId = 0;

    function createNode(recipe: GameRecipe, machine: GameMachine, nodeCreationPosition: Point)
    {
        const node = new SankeyNode(nodeId++, nodeCreationPosition, recipe, machine);

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

        registerForSave(node);

        return node;
    };

    function registerForSave(node: SankeyNode)
    {
      node.addEventListener(SankeyNode.positionChangedEvent, saveState);
      node.addEventListener(SankeyNode.resourcesAmountChangedEvent, saveState);
      node.addEventListener(SankeyNode.overclockRatioChangedEvent, saveState);
      node.addEventListener(SankeyNode.machinesAmountChangedEvent, saveState);
      node.addEventListener(SankeyNode.connectionsChangedEvent, saveState);
      node.addEventListener(SankeyNode.deletionEvent, () =>
      {
        nodes.splice(nodes.indexOf(node));
        saveState();
      });

      nodes.push(node);
      saveState();
    }

    type NodeStripped = {
      id: number,
      position: Point,
      inputResourcesAmount: number,
      outputResourcesAmount: number,
      overclockRatio: number,
      machinesAmount: number,
      inputs: {
        resourceId: string,
        resourcesAmount: number,
        nodes: number[]
      }[],
      // outputs: number[],
      recipe: string
    };

    let lastSave = Date.now();

    async function saveState()
    {
      let time = Date.now();
      lastSave = time;

      await new Promise(resolve => setTimeout(resolve, 2500));

      if (lastSave > time) return;

      let data = [];
      for (let node of nodes)
      {
        let inputs = node.inputSlotGroups.map(group => ({
          resourceId: group.resourceId,
          resourcesAmount: group.resourcesAmount,
          nodes: group.slots.flatMap(slot => slot.links.map(link => [link, slot] as const))
                            .map(([link, slot]) => link.firstSlot === slot ? link.secondSlot : link.firstSlot)
                            .map(slot => slot.parentGroup)
                            .map(group => group.parentNode)
                            .map(node => node.id)
        }));

        let nodeStripped: NodeStripped = {
          id: node.id,
          position: node.position,
          inputResourcesAmount: node.inputResourcesAmount,
          outputResourcesAmount: node.outputResourcesAmount,
          overclockRatio: node.overclockRatio,
          machinesAmount: node.machinesAmount,
          inputs: inputs,
          recipe: node.recipe.id
        };
        data.push(nodeStripped);
      }
      let dataJson = JSON.stringify(data);
      let dataCompressedStream = new Blob([dataJson]).stream().pipeThrough(new CompressionStream(`deflate`));
      let dataCompressed = await new Response(dataCompressedStream).arrayBuffer();
      let dataEncoded = encodeURI(btoa(String.fromCharCode(...new Uint8Array(dataCompressed))));
      location.hash = dataEncoded;
    } // ↑ Hell is right here, yeah ↓
    async function loadState()
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
      let dataJson = await new Response(dataStream).text();
      let data: NodeStripped[] = JSON.parse(dataJson);

      for (let nodeStripped of data)
      {
        let recipe: GameRecipe | undefined;
        let machine: GameMachine | undefined;
        for (let foundMachine of satisfactoryData.machines)
        {
          let foundRecipe = foundMachine.recipes.find(recipe => recipe.id === nodeStripped.recipe);
          if (foundRecipe != null)
          {
            recipe = foundRecipe;
            machine = foundMachine;
            break;
          }
        }
        if (recipe == null || machine == null) throw new Error();

        let node = createNode(recipe, machine, nodeStripped.position);
        node.inputResourcesAmount = nodeStripped.inputResourcesAmount;
        node.machinesAmount = nodeStripped.machinesAmount;
        node.outputResourcesAmount = nodeStripped.outputResourcesAmount;
        node.overclockRatio = nodeStripped.overclockRatio;
      }

      for (let nodeStripped of data)
      {
        let node = nodes.find(node => node.id === nodeStripped.id)!;

        for (let input of nodeStripped.inputs)
        {
          for (let outputNodeId of input.nodes)
          {
            let outputNode = nodes.find(node => node.id === outputNodeId)!;
            let outputGroup = outputNode.outputSlotGroups.find(group => group.resourceId === input.resourceId)!;
            let outputSlot = outputGroup.addSlot(input.resourcesAmount);

            let inputGroup = node.inputSlotGroups.find(group => group.resourceId === input.resourceId)!;
            let inputSlot = inputGroup.addSlot(input.resourcesAmount);

            SankeyLink.connect(outputSlot, inputSlot, PanZoomConfiguration.context);
          }
        }
      }
    }

    recipeSelectionModal.addEventListener(RecipeSelectionModal.recipeConfirmedEvent, () =>
    {
        let recipe = recipeSelectionModal.selectedRecipe!;

        createNode(recipe.recipe, recipe.madeIn, nodeCreationPosition);
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

    await loadState();
}

main().catch((reason) =>
{
    console.error(reason);
});
