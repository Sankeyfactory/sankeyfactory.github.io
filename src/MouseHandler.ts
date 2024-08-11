import { PanZoom } from "panzoom";
import { Point } from "./Point";
import { SankeyNode } from "./Sankey/SankeyNode";
import { SankeySlot } from "./Sankey/Slots/SankeySlot";
import { SvgFactory } from "./SVG/SvgFactory";
import { Rectangle } from "./Rectangle";
import { SankeyLink } from "./Sankey/SankeyLink";
import { SlotsGroup } from "./Sankey/SlotsGroup";

export class MouseHandler
{
    public static getInstance()
    {
        if (this.instance != undefined)
        {
            return this.instance;
        }
        else
        {
            this.instance = new this();
            return this.instance;
        }
    }

    public setPanContext(panContext: PanZoom)
    {
        this.panContext = panContext;
    }

    public handleMouseMove(event: MouseEvent)
    {
        if (this.panContext == undefined)
        {
            throw Error("Pan context must be initialized before using mouse handlers");
        }

        if (this.mouseStatus == MouseHandler.MouseStatus.DraggingNode)
        {
            if (this.draggedNode == undefined)
            {
                throw Error("Dragged node wasn't saved.");
            }

            // TODO: Do something with this nightmare.
            let previousPos: Point = {
                x: parseFloat(this.draggedNode.nodeSvgGroup.getAttribute("transform")!
                    .split("translate(")[1].split(",")[0]),
                y: parseFloat(this.draggedNode.nodeSvgGroup.getAttribute("transform")!
                    .split("translate(")[1].split(",")[1])
            };

            let zoomScale = this.panContext.getTransform().scale;

            let mousePosDelta: Point = {
                x: event.clientX - this.lastMousePos.x,
                y: event.clientY - this.lastMousePos.y
            };

            // TODO: Refactor.
            let translate = `translate(${previousPos.x + mousePosDelta.x / zoomScale}, `
                + `${previousPos.y + mousePosDelta.y / zoomScale})`;

            this.draggedNode.nodeSvgGroup.setAttribute("transform", translate);

            this.draggedNode.recalculateLinks();

            this.lastMousePos.x = event.clientX;
            this.lastMousePos.y = event.clientY;
        }
        else if (
            this.mouseStatus == MouseHandler.MouseStatus.ConnectingInputSlot
            || this.mouseStatus == MouseHandler.MouseStatus.ConnectingOutputSlot)
        {
            if (this.firstConnectingSlot == undefined)
            {
                throw Error("First connecting slot wasn't saved.");
            }
            if (this.slotConnectingLine == undefined)
            {
                throw Error("Slot connecting line wasn't created.");
            }

            const domPoint = new DOMPointReadOnly(event.clientX, event.clientY);
            const svgMousePos = domPoint.matrixTransform(this.viewport.getScreenCTM()!.inverse());

            this.slotConnectingLine.setAttribute("x2", `${svgMousePos.x - 2}`);
            this.slotConnectingLine.setAttribute("y2", `${svgMousePos.y - 2}`);
        }
    }

    public handleMouseUp()
    {
        if (this.mouseStatus === MouseHandler.MouseStatus.DraggingNode)
        {
            this.mouseStatus = MouseHandler.MouseStatus.Free;

            this.draggedNode = undefined;

            this.lastMousePos.x = 0;
            this.lastMousePos.y = 0;
        }
    }

    public cancelConnectingSlots()
    {
        this.firstConnectingSlot = undefined;
        this.slotConnectingLine?.remove();
        this.slotConnectingLine = undefined;
        this.mouseStatus = MouseHandler.MouseStatus.Free;
    }

    public inputSlotClicked(event: MouseEvent, targetSlot: SankeySlot)
    {
        if (this.mouseStatus === MouseHandler.MouseStatus.Free)
        {
            this.mouseStatus = MouseHandler.MouseStatus.ConnectingInputSlot;

            this.startConnectingSlot(event, targetSlot, true);
        }
        else if (this.mouseStatus === MouseHandler.MouseStatus.ConnectingOutputSlot)
        {
            if (this.panContext == undefined)
            {
                throw Error("Pan context must be initialized before using mouse handlers");
            }
            if (this.firstConnectingSlot == undefined)
            {
                throw Error("First connecting slot wasn't saved.");
            }

            let resourcesAmount =
                Math.min(targetSlot.resourcesAmount, this.firstConnectingSlot.resourcesAmount);

            let newSlot1 = this.firstConnectingSlot.parentGroup.addSlot(resourcesAmount);
            let newSlot2 = targetSlot.parentGroup.addSlot(resourcesAmount);

            let link = new SankeyLink(newSlot1, newSlot2, this.panContext);

            newSlot1.connectedLink = link;
            newSlot2.connectedLink = link;

            this.cancelConnectingSlots();
        }
    }

    public outputSlotClicked(event: MouseEvent, targetSlot: SankeySlot)
    {
        if (this.mouseStatus === MouseHandler.MouseStatus.Free)
        {
            this.mouseStatus = MouseHandler.MouseStatus.ConnectingOutputSlot;

            this.startConnectingSlot(event, targetSlot, false);
        }
        else if (this.mouseStatus === MouseHandler.MouseStatus.ConnectingInputSlot)
        {
            if (this.panContext == undefined)
            {
                throw Error("Pan context must be initialized before using mouse handlers");
            }
            if (this.firstConnectingSlot == undefined)
            {
                throw Error("First connecting slot wasn't saved.");
            }

            let resourcesAmount =
                Math.min(targetSlot.resourcesAmount, this.firstConnectingSlot.resourcesAmount);

            let newSlot1 = this.firstConnectingSlot.parentGroup.addSlot(resourcesAmount);
            let newSlot2 = targetSlot.parentGroup.addSlot(resourcesAmount);

            let link = new SankeyLink(newSlot1, newSlot2, this.panContext);

            newSlot1.connectedLink = link;
            newSlot2.connectedLink = link;

            this.cancelConnectingSlots();
        }
    }

    private startConnectingSlot(event: MouseEvent, firstSlot: SankeySlot, isInput: boolean)
    {
        if (this.panContext == undefined)
        {
            throw Error("Pan context must be initialized before using mouse handlers");
        }

        this.firstConnectingSlot = firstSlot;

        let zoomScale = this.panContext.getTransform().scale;

        let slotBounds: Rectangle = (firstSlot.slotSvg as SVGRectElement).getBoundingClientRect();
        slotBounds = {
            x: (slotBounds.x - this.panContext.getTransform().x) / zoomScale,
            y: (slotBounds.y - this.panContext.getTransform().y) / zoomScale,
            width: slotBounds.width / zoomScale,
            height: slotBounds.height / zoomScale,
        };

        let startPos: Point = {
            x: slotBounds.x + (isInput ? 0 : slotBounds.width),
            y: slotBounds.y + (slotBounds.height / 2)
        };

        const domPoint = new DOMPointReadOnly(event.clientX, event.clientY);
        const svgMousePos = domPoint.matrixTransform(this.viewport.getScreenCTM()!.inverse());

        this.slotConnectingLine =
            SvgFactory.createSvgLine(startPos, {
                x: svgMousePos.x - 2,
                y: svgMousePos.y - 2
            }, "link-hint");

        this.viewport.appendChild(this.slotConnectingLine);
    }

    public startDraggingNode(event: MouseEvent, node: SankeyNode)
    {
        if (this.mouseStatus === MouseHandler.MouseStatus.Free)
        {
            this.mouseStatus = MouseHandler.MouseStatus.DraggingNode;

            this.draggedNode = node;

            this.lastMousePos.x = event.clientX;
            this.lastMousePos.y = event.clientY;
        }
    }

    private constructor()
    { }

    private static instance: MouseHandler | undefined;

    private panContext: PanZoom | undefined;

    private firstConnectingSlot: SankeySlot | undefined;
    private draggedNode: SankeyNode | undefined;
    private slotConnectingLine: SVGLineElement | undefined;

    private mouseStatus: MouseHandler.MouseStatus = MouseHandler.MouseStatus.Free;
    private lastMousePos = new Point(0, 0);

    private readonly viewport = document.querySelector("#viewport") as SVGGElement;
}

export namespace MouseHandler
{
    export enum MouseStatus
    {
        Free,
        DraggingNode,
        ConnectingInputSlot,
        ConnectingOutputSlot
    }
}
