import { PanZoom } from "panzoom";
import { Point } from "./Point";
import { SankeyNode } from "./Sankey/SankeyNode";
import { SvgFactory } from "./SVG/SvgFactory";
import { Rectangle } from "./Rectangle";
import { SankeyLink } from "./Sankey/SankeyLink";
import { SankeySlotMissing } from "./Sankey/Slots/SankeySlotMissing";
import { SankeySlotExceeding } from "./Sankey/Slots/SankeySlotExceeding";
import { Curve } from "./Curve";
import { SvgPathBuilder } from "./SVG/SvgPathBuilder";

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

        if (this.mouseStatus === MouseHandler.MouseStatus.DraggingNode)
        {
            if (this.draggedNode == undefined)
            {
                throw Error("Dragged node wasn't saved.");
            }

            let previousPos = this.draggedNode.position;

            let zoomScale = this.panContext.getTransform().scale;

            let mousePosDelta: Point = {
                x: event.clientX - this.lastMousePos.x,
                y: event.clientY - this.lastMousePos.y
            };

            this.draggedNode.position = {
                x: previousPos.x + mousePosDelta.x / zoomScale,
                y: previousPos.y + mousePosDelta.y / zoomScale
            };

            this.lastMousePos.x = event.clientX;
            this.lastMousePos.y = event.clientY;
        }
        else if (
            this.mouseStatus === MouseHandler.MouseStatus.ConnectingInputSlot
            || this.mouseStatus === MouseHandler.MouseStatus.ConnectingOutputSlot)
        {
            if (this.firstConnectingSlot == undefined)
            {
                throw Error("First connecting slot wasn't saved.");
            }
            if (this.slotConnectingLine == undefined || this.slotConnectingCurve == undefined)
            {
                throw Error("Slot connecting line wasn't created.");
            }

            const domPoint = new DOMPointReadOnly(event.clientX, event.clientY);
            const svgMousePos = domPoint.matrixTransform(this.viewport.getScreenCTM()!.inverse());

            this.slotConnectingCurve = Curve.fromTwoPoints(
                this.slotConnectingCurve.startPoint,
                svgMousePos
            );

            let path = new SvgPathBuilder()
                .startAt(this.slotConnectingCurve.startPoint)
                .curve(this.slotConnectingCurve)
                .build();

            this.slotConnectingLine.setAttribute("d", path);
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
        this.slotConnectingCurve = undefined;
        this.mouseStatus = MouseHandler.MouseStatus.Free;
    }

    public inputSlotClicked(event: MouseEvent, targetSlot: SankeySlotMissing)
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

            if (this.firstConnectingSlot.resourceId != targetSlot.resourceId)
            {
                return;
            }

            let resourcesAmount =
                Math.min(targetSlot.resourcesAmount, this.firstConnectingSlot.resourcesAmount);

            let newSlot1 = this.firstConnectingSlot.splitOffSlot(resourcesAmount);
            let newSlot2 = targetSlot.splitOffSlot(resourcesAmount);

            SankeyLink.connect(newSlot1, newSlot2, this.panContext);

            this.cancelConnectingSlots();
        }
    }

    public outputSlotClicked(event: MouseEvent, targetSlot: SankeySlotExceeding)
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

            if (this.firstConnectingSlot.resourceId != targetSlot.resourceId)
            {
                return;
            }

            let resourcesAmount =
                Math.min(targetSlot.resourcesAmount, this.firstConnectingSlot.resourcesAmount);

            let newSlot1 = this.firstConnectingSlot.splitOffSlot(resourcesAmount);
            let newSlot2 = targetSlot.splitOffSlot(resourcesAmount);

            SankeyLink.connect(newSlot1, newSlot2, this.panContext);

            this.cancelConnectingSlots();
        }
    }

    private startConnectingSlot(
        event: MouseEvent,
        firstSlot: SankeySlotExceeding | SankeySlotMissing,
        isInput: boolean)
    {
        if (this.panContext == undefined)
        {
            throw Error("Pan context must be initialized before using mouse handlers");
        }

        this.firstConnectingSlot = firstSlot;

        let zoomScale = this.panContext.getTransform().scale;

        let slotBounds: Rectangle = firstSlot.slotSvgRect.getBoundingClientRect();
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

        this.slotConnectingCurve = Curve.fromTwoPoints(
            startPos,
            svgMousePos
        );

        let path = new SvgPathBuilder()
            .startAt(this.slotConnectingCurve.startPoint)
            .curve(this.slotConnectingCurve)
            .build();

        this.slotConnectingLine = SvgFactory.createSvgPath("link-hint");
        this.slotConnectingLine.classList.add(isInput ? "from-input" : "from-output");
        this.slotConnectingLine.setAttribute("d", path);

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

    private firstConnectingSlot: SankeySlotMissing | SankeySlotExceeding | undefined;
    private draggedNode: SankeyNode | undefined;

    private slotConnectingLine: SVGPathElement | undefined;
    private slotConnectingCurve?: Curve;

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
