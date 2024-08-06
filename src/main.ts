import panzoom from "panzoom";
import { SankeyNode } from "./SankeyNode";
import { SankeyLink } from "./SankeyLink";

async function main() {
    let viewport = document.getElementById("viewport");

    if (viewport == null) {
        throw new Error("Couldn't find viewport");
    }

    let draggedObject: SankeyNode | undefined;
    let isHoldingAlt = false;

    let lastX = 0;
    let lastY = 0;

    let lastNode: SankeyNode | undefined;

    let panContext = panzoom(viewport, {
        zoomDoubleClickSpeed: 1, // disables double click zoom
        beforeMouseDown: () => {
            return !isHoldingAlt;
        }
    });

    window.addEventListener("keydown", (event) => {
        if (event.repeat) {
            return;
        }

        if (event.key == "Alt") {
            isHoldingAlt = true;
            document.querySelector("#container")!.classList.add("move");
        }
    });

    window.addEventListener("keyup", (event) => {
        if (event.repeat) {
            return;
        }

        if (event.key == "Alt") {
            isHoldingAlt = false;
            document.querySelector("#container")!.classList.remove("move");
        }
    });

    window.addEventListener("keypress", (event) => {
        if (event.code === "KeyN") {
            let nodeSvg = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
            const node = new SankeyNode(nodeSvg, undefined, undefined);

            node.svgRect.setAttribute("class", "machine");

            node.svgRect.setAttribute("width", "50");
            node.svgRect.setAttribute("height", "200");
            node.svgRect.setAttribute("x", "50");
            node.svgRect.setAttribute("y", "50");

            node.svgRect.onmousedown = (event) => {
                if (!isHoldingAlt && event.buttons === 1) {
                    draggedObject = node;

                    lastX = event.screenX;
                    lastY = event.screenY;
                }
            }

            if (lastNode != undefined) {
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

        lastX = 0;
        lastY = 0;
    }

    window.onmousemove = (event) => {
        if (draggedObject != undefined) {
            let oldX = +draggedObject.svgRect.getAttribute("x")!;
            let oldY = +draggedObject.svgRect.getAttribute("y")!;

            let zoomScale = panContext.getTransform().scale;

            draggedObject.svgRect.setAttribute('x', (oldX + (event.screenX - lastX) / zoomScale).toString());
            draggedObject.svgRect.setAttribute('y', (oldY + (event.screenY - lastY) / zoomScale).toString());

            if (draggedObject.leftLink != undefined) {
                draggedObject.leftLink.recalculate();
            }

            if (draggedObject.rightLink != undefined) {
                draggedObject.rightLink.recalculate();
            }

            lastX = event.screenX;
            lastY = event.screenY;
        }
    }
}

main().catch((reason) => {
    console.error(reason);
});
