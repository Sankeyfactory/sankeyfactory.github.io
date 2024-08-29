import { Point } from "./Geometry/Point";
import { SankeyNode } from "./Sankey/SankeyNode";
import { SvgFactory } from "./SVG/SvgFactory";
import { Rectangle } from "./Geometry/Rectangle";
import { SankeyLink } from "./Sankey/SankeyLink";
import { SankeySlotMissing } from "./Sankey/Slots/SankeySlotMissing";
import { SankeySlotExceeding } from "./Sankey/Slots/SankeySlotExceeding";
import { Curve } from "./Geometry/Curve";
import { SvgPathBuilder } from "./SVG/SvgPathBuilder";
import { PanZoomConfiguration } from "./PanZoomConfiguration";
import { Settings } from "./Settings";

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

    public handleMouseMove(event: MouseEvent)
    {
        if (this.mouseStatus === MouseHandler.MouseStatus.DraggingNode)
        {
            this.dragNodeTo({ x: event.clientX, y: event.clientY });
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

            const svgMousePos = MouseHandler.clientToCanvasPosition({ x: event.clientX, y: event.clientY });

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

    public handleTouchMove(event: TouchEvent)
    {
        if (this.mouseStatus === MouseHandler.MouseStatus.DraggingNode
            && event.touches.length === 1)
        {
            let touch = event.touches[0];

            this.dragNodeTo({ x: touch.clientX, y: touch.clientY });
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
        if (this.mouseStatus == MouseHandler.MouseStatus.ConnectingInputSlot
            || this.mouseStatus == MouseHandler.MouseStatus.ConnectingOutputSlot
        )
        {
            this.firstConnectingSlot = undefined;
            this.slotConnectingLine?.remove();
            this.slotConnectingLine = undefined;
            this.slotConnectingCurve = undefined;
            this.mouseStatus = MouseHandler.MouseStatus.Free;
            Settings.instance.connectingResource = undefined;
        }
    }

    public inputSlotClicked(event: MouseEvent, targetSlot: SankeySlotMissing)
    {
        if (this.mouseStatus === MouseHandler.MouseStatus.Free)
        {
            this.mouseStatus = MouseHandler.MouseStatus.ConnectingInputSlot;

            this.startConnectingSlot(event, targetSlot, true);

            Settings.instance.connectingResource = { type: "input", id: targetSlot.resourceId };
        }
        else if (this.mouseStatus === MouseHandler.MouseStatus.ConnectingOutputSlot)
        {
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

            SankeyLink.connect(newSlot1, newSlot2, PanZoomConfiguration.context);

            this.cancelConnectingSlots();
        }
    }

    public outputSlotClicked(event: MouseEvent, targetSlot: SankeySlotExceeding)
    {
        if (this.mouseStatus === MouseHandler.MouseStatus.Free)
        {
            this.mouseStatus = MouseHandler.MouseStatus.ConnectingOutputSlot;

            this.startConnectingSlot(event, targetSlot, false);

            Settings.instance.connectingResource = { type: "output", id: targetSlot.resourceId };
        }
        else if (this.mouseStatus === MouseHandler.MouseStatus.ConnectingInputSlot)
        {
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

            SankeyLink.connect(newSlot1, newSlot2, PanZoomConfiguration.context);

            this.cancelConnectingSlots();
        }
    }

    private dragNodeTo(position: Point)
    {
        if (this.draggedNode == undefined)
        {
            throw Error("Dragged node wasn't saved.");
        }

        let previousPos = this.draggedNode.position;

        let zoomScale = PanZoomConfiguration.context.getTransform().scale;

        let mousePosDelta: Point = {
            x: position.x - this.lastMousePos.x,
            y: position.y - this.lastMousePos.y
        };

        this.draggedNode.position = {
            x: previousPos.x + mousePosDelta.x / zoomScale,
            y: previousPos.y + mousePosDelta.y / zoomScale
        };

        this.lastMousePos.x = position.x;
        this.lastMousePos.y = position.y;
    }

    private startConnectingSlot(
        event: MouseEvent,
        firstSlot: SankeySlotExceeding | SankeySlotMissing,
        isInput: boolean)
    {
        this.firstConnectingSlot = firstSlot;

        let zoomScale = PanZoomConfiguration.context.getTransform().scale;

        let slotBounds: Rectangle = firstSlot.slotSvgRect.getBoundingClientRect();
        slotBounds = {
            x: (slotBounds.x - PanZoomConfiguration.context.getTransform().x) / zoomScale,
            y: (slotBounds.y - PanZoomConfiguration.context.getTransform().y) / zoomScale,
            width: slotBounds.width / zoomScale,
            height: slotBounds.height / zoomScale,
        };

        let startPos: Point = {
            x: slotBounds.x + (isInput ? 0 : slotBounds.width),
            y: slotBounds.y + (slotBounds.height / 2)
        };

        const svgMousePos = MouseHandler.clientToCanvasPosition({ x: event.clientX, y: event.clientY });

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

    public startDraggingNode(node: SankeyNode, position: Point)
    {
        if (this.mouseStatus === MouseHandler.MouseStatus.Free)
        {
            this.mouseStatus = MouseHandler.MouseStatus.DraggingNode;

            this.draggedNode = node;

            this.lastMousePos.x = position.x;
            this.lastMousePos.y = position.y;
        }
    }

    public static clientToCanvasPosition(clientPosition: Point): Point
    {
        let viewport = document.querySelector("#viewport") as SVGGElement;

        const domPoint = new DOMPointReadOnly(clientPosition.x, clientPosition.y);

        return domPoint.matrixTransform(viewport.getScreenCTM()!.inverse());
    }

    private constructor()
    { }

    private static instance: MouseHandler | undefined;

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
