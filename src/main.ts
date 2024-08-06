import panzoom from "panzoom";
import { SankeyNode } from "./SankeyNode";
import { SankeyLink } from "./SankeyLink";
import { Point } from "./Point";

async function main()
{
    let viewport: SVGElement | null = document.querySelector("#viewport");
    let nodesGroup = document.querySelector("g.nodes");
    let linksGroup = document.querySelector("g.links");

    if (viewport == null || nodesGroup == null || linksGroup == null)
    {
        throw new Error("Svg container is broken");
    }

    let draggedObject: SankeyNode | undefined;
    let isHoldingAlt = false;

    let lastMousePos = new Point(0, 0);

    let lastNode: SankeyNode | undefined;

    let panContext = panzoom(viewport, {
        zoomDoubleClickSpeed: 1, // disables double click zoom
        beforeMouseDown: () =>
        {
            return !isHoldingAlt;
        }
    });

    window.addEventListener("keydown", (event) =>
    {
        if (event.repeat) { return; }

        if (event.key == "Alt")
        {
            isHoldingAlt = true;
            document.querySelector("#container")!.classList.add("move");
        }
    });

    window.addEventListener("keyup", (event) =>
    {
        if (event.repeat) { return; }

        if (event.key == "Alt")
        {
            isHoldingAlt = false;
            document.querySelector("#container")!.classList.remove("move");
        }
    });

    window.addEventListener("keypress", (event) =>
    {
        if (event.code === "KeyN")
        {

            let nodeGroup = document.createElementNS("http://www.w3.org/2000/svg", 'g');
            nodeGroup.classList.add("node");
            nodeGroup.setAttribute("transform", "translate(50, 50)");

            let nodeHeight = 240;
            let nodeWidth = 60;
            let slotWidth = 6;

            let rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
            rect.classList.add("machine");
            rect.setAttribute("width", `${nodeWidth}`);
            rect.setAttribute("height", `${nodeHeight}`);
            rect.setAttribute("x", `${slotWidth}`);

            let inputSlotsGroup = document.createElementNS("http://www.w3.org/2000/svg", 'g');
            inputSlotsGroup.classList.add("input-slots");
            inputSlotsGroup.setAttribute("transform", "translate(0, 0)");

            // For testing purposes. TODO: Remove later.
            let inputSlot1 = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
            inputSlot1.classList.add("input-slot");
            inputSlot1.setAttribute("width", `${slotWidth}`);
            inputSlot1.setAttribute("height", `${nodeHeight * 0.2}`);
            inputSlot1.setAttribute("y", `${0}`);
            let inputSlot2 = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
            inputSlot2.classList.add("input-slot");
            inputSlot2.setAttribute("width", `${slotWidth}`);
            inputSlot2.setAttribute("height", `${nodeHeight * 0.3}`);
            inputSlot2.setAttribute("y", `${nodeHeight * 0.2}`);
            // //

            let missingInputSlot = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
            missingInputSlot.classList.add("input-slot", "missing");
            missingInputSlot.setAttribute("width", `${slotWidth}`);
            missingInputSlot.setAttribute("height", `${nodeHeight * 0.5}`);
            missingInputSlot.setAttribute("y", `${nodeHeight * 0.5}`);

            let outputSlotsGroup = document.createElementNS("http://www.w3.org/2000/svg", 'g');
            inputSlotsGroup.classList.add("output-slots");
            outputSlotsGroup.setAttribute("transform", `translate(${slotWidth + nodeWidth}, 0)`);

            // For testing purposes. TODO: Remove later.
            let outputSlot1 = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
            outputSlot1.classList.add("output-slot");
            outputSlot1.setAttribute("width", `${slotWidth}`);
            outputSlot1.setAttribute("height", `${nodeHeight * 0.4}`);
            outputSlot1.setAttribute("y", `${0}`);
            let outputSlot2 = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
            outputSlot2.classList.add("output-slot");
            outputSlot2.setAttribute("width", `${slotWidth}`);
            outputSlot2.setAttribute("height", `${nodeHeight * 0.4}`);
            outputSlot2.setAttribute("y", `${nodeHeight * 0.4}`);
            // //

            let exceedingOutputSlot = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
            exceedingOutputSlot.classList.add("output-slot", "exceeding");
            exceedingOutputSlot.setAttribute("width", `${slotWidth}`);
            exceedingOutputSlot.setAttribute("height", `${nodeHeight * 0.2}`);
            exceedingOutputSlot.setAttribute("y", `${nodeHeight * 0.8}`);

            const node = new SankeyNode(nodeGroup);

            rect.onmousedown = (event) =>
            {
                if (!isHoldingAlt && event.buttons === 1)
                {
                    draggedObject = node;

                    lastMousePos.x = event.screenX;
                    lastMousePos.y = event.screenY;
                }
            };

            nodeGroup.appendChild(rect);

            inputSlotsGroup.appendChild(inputSlot1);
            inputSlotsGroup.appendChild(inputSlot2);
            inputSlotsGroup.appendChild(missingInputSlot);
            nodeGroup.appendChild(inputSlotsGroup);

            outputSlotsGroup.appendChild(outputSlot1);
            outputSlotsGroup.appendChild(outputSlot2);
            outputSlotsGroup.appendChild(exceedingOutputSlot);
            nodeGroup.appendChild(outputSlotsGroup);

            linksGroup.appendChild(nodeGroup);

            // TODO: link creation
        }
    });

    window.onmouseup = () =>
    {
        draggedObject = undefined;

        lastMousePos.x = 0;
        lastMousePos.y = 0;
    };

    window.onmousemove = (event) =>
    {
        if (draggedObject != undefined)
        {
            // TODO: Do something with this nightmare.
            let previousPos: Point = {
                x: parseFloat(draggedObject.nodeGroup.getAttribute("transform")!
                    .split("translate(")[1].split(",")[0]),
                y: parseFloat(draggedObject.nodeGroup.getAttribute("transform")!
                    .split("translate(")[1].split(",")[1])
            };

            let zoomScale = panContext.getTransform().scale;

            let mousePosDelta: Point = {
                x: event.screenX - lastMousePos.x,
                y: event.screenY - lastMousePos.y
            };

            // TODO: Refactor.
            let translate = `translate(${previousPos.x + mousePosDelta.x / zoomScale}, `
                + `${previousPos.y + mousePosDelta.y / zoomScale})`;

            draggedObject.nodeGroup.setAttribute("transform", translate);

            if (draggedObject.leftLink != undefined)
            {
                draggedObject.leftLink.recalculate();
            }

            if (draggedObject.rightLink != undefined)
            {
                draggedObject.rightLink.recalculate();
            }

            lastMousePos.x = event.screenX;
            lastMousePos.y = event.screenY;
        }
    };
}

main().catch((reason) =>
{
    console.error(reason);
});
