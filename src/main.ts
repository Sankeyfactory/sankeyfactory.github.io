import panzoom from "panzoom";
import { SankeyNode } from "./Sankey/SankeyNode";
import { SankeyLink } from "./Sankey/SankeyLink";
import { Point } from "./Point";

async function main()
{
    let viewport: SVGElement | null = document.querySelector("#viewport");
    let nodesGroup = document.querySelector("g.nodes") as SVGGElement;
    let linksGroup = document.querySelector("g.links") as SVGGElement;

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
            const node = new SankeyNode(nodesGroup, new Point(50, 50), [50, 50], [100]);

            node.nodeSvg.onmousedown = (event) =>
            {
                if (!isHoldingAlt && event.buttons === 1)
                {
                    draggedObject = node;

                    lastMousePos.x = event.screenX;
                    lastMousePos.y = event.screenY;
                }
            };
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
                x: parseFloat(draggedObject.nodeSvgGroup.getAttribute("transform")!
                    .split("translate(")[1].split(",")[0]),
                y: parseFloat(draggedObject.nodeSvgGroup.getAttribute("transform")!
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

            draggedObject.nodeSvgGroup.setAttribute("transform", translate);

            // if (draggedObject.leftLink != undefined)
            // {
            //     draggedObject.leftLink.recalculate();
            // }

            // if (draggedObject.rightLink != undefined)
            // {
            //     draggedObject.rightLink.recalculate();
            // }

            lastMousePos.x = event.screenX;
            lastMousePos.y = event.screenY;
        }
    };
}

main().catch((reason) =>
{
    console.error(reason);
});
