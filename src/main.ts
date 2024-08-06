import panzoom from "panzoom";
import { SankeyNode } from "./SankeyNode";
import { SankeyLink } from "./SankeyLink";
import { Point } from "./Point";

async function main() {
    let viewport = document.getElementById("viewport");

    if (viewport == null)
    {
        throw new Error("Couldn't find viewport");
    }

    let draggedObject: SankeyNode | undefined;
    let isHoldingAlt = false;

    let lastMousePos = new Point(0, 0);

    let lastNode: SankeyNode | undefined;

    let panContext = panzoom(viewport, {
        zoomDoubleClickSpeed: 1, // disables double click zoom
        beforeMouseDown: () => {
            return !isHoldingAlt;
        }
    });

    window.addEventListener("keydown", (event) => {
        if (event.repeat) { return; }

        if (event.key == "Alt")
        {
            isHoldingAlt = true;
            document.querySelector("#container")!.classList.add("move");
        }
    });

    window.addEventListener("keyup", (event) => {
        if (event.repeat) { return; }

        if (event.key == "Alt")
        {
            isHoldingAlt = false;
            document.querySelector("#container")!.classList.remove("move");
        }
    });

    window.addEventListener("keypress", (event) => {
        if (event.code === "KeyN")
        {
            let nodeSvg = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
            const node = new SankeyNode(nodeSvg);

            node.svgRect.setAttribute("class", "machine");

            node.svgRect.setAttribute("width", "50");
            node.svgRect.setAttribute("height", "200");
            node.svgRect.setAttribute("x", "50");
            node.svgRect.setAttribute("y", "50");

            node.svgRect.onmousedown = (event) => {
                if (!isHoldingAlt && event.buttons === 1)
                {
                    draggedObject = node;

                    lastMousePos.x = event.screenX;
                    lastMousePos.y = event.screenY;
                }
            };

            if (lastNode != undefined)
            {
                let linkSvg = document.createElementNS("http://www.w3.org/2000/svg", 'path');
                linkSvg.setAttribute("class", "link");

                let link = new SankeyLink(lastNode, node, linkSvg);

                lastNode.rightLink = link;
                node.leftLink = link;

                link.recalculate();

                viewport.appendChild(linkSvg);
            }

            lastNode = node;

            viewport.appendChild(nodeSvg);
        }
    });

    window.onmouseup = () => {
        draggedObject = undefined;

        lastMousePos.x = 0;
        lastMousePos.y = 0;
    };

    window.onmousemove = (event) => {
        if (draggedObject != undefined)
        {
            let previousPos: Point = {
                x: +draggedObject.svgRect.getAttribute("x")!,
                y: +draggedObject.svgRect.getAttribute("y")!
            };

            let zoomScale = panContext.getTransform().scale;

            let mousePosDelta: Point = {
                x: event.screenX - lastMousePos.x,
                y: event.screenY - lastMousePos.y
            };

            draggedObject.svgRect.setAttribute('x', `${previousPos.x + mousePosDelta.x / zoomScale}`);
            draggedObject.svgRect.setAttribute('y', `${previousPos.y + mousePosDelta.y / zoomScale}`);

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

main().catch((reason) => {
    console.error(reason);
});
