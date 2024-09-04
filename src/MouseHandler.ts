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
import { AppData } from "./AppData";

export class MouseHandler extends EventTarget
{
    public static readonly startedConnectingSlotsEvent = "started-connecting-slots";
    public static readonly finishedConnectingSlotsEvent = "finished-connecting-slots";

    public static getInstance()
    {
        if (this._instance != undefined)
        {
            return this._instance;
        }
        else
        {
            this._instance = new this();
            return this._instance;
        }
    }

    public handleMouseMove(event: MouseEvent)
    {
        if (this._mouseStatus === MouseHandler.MouseStatus.DraggingNode)
        {
            this.dragNodeTo({ x: event.clientX, y: event.clientY });
        }
        else if (
            this._mouseStatus === MouseHandler.MouseStatus.ConnectingInputSlot
            || this._mouseStatus === MouseHandler.MouseStatus.ConnectingOutputSlot)
        {
            if (this._firstConnectingSlot == undefined)
            {
                throw Error("First connecting slot wasn't saved.");
            }
            if (this._slotConnectingLine == undefined || this._slotConnectingCurve == undefined)
            {
                throw Error("Slot connecting line wasn't created.");
            }

            const svgMousePos = MouseHandler.clientToCanvasPosition({ x: event.clientX, y: event.clientY });

            this._slotConnectingCurve = Curve.fromTwoPoints(
                this._slotConnectingCurve.startPoint,
                svgMousePos
            );

            let path = new SvgPathBuilder()
                .startAt(this._slotConnectingCurve.startPoint)
                .curve(this._slotConnectingCurve)
                .build();

            this._slotConnectingLine.setAttribute("d", path);
        }
    }

    public handleTouchMove(event: TouchEvent)
    {
        if (this._mouseStatus === MouseHandler.MouseStatus.DraggingNode
            && event.touches.length === 1)
        {
            let touch = event.touches[0];

            this.dragNodeTo({ x: touch.clientX, y: touch.clientY });
        }
    }

    public handleMouseUp()
    {
        if (this._mouseStatus === MouseHandler.MouseStatus.DraggingNode)
        {
            this._mouseStatus = MouseHandler.MouseStatus.Free;

            this._draggedNode = undefined;

            this._lastMousePos.x = 0;
            this._lastMousePos.y = 0;

            AppData.saveToUrl();
        }
    }

    public cancelConnectingSlots()
    {
        if (this._mouseStatus == MouseHandler.MouseStatus.ConnectingInputSlot
            || this._mouseStatus == MouseHandler.MouseStatus.ConnectingOutputSlot
        )
        {
            this._firstConnectingSlot = undefined;
            this._slotConnectingLine?.remove();
            this._slotConnectingLine = undefined;
            this._slotConnectingCurve = undefined;
            this._mouseStatus = MouseHandler.MouseStatus.Free;
            Settings.instance.connectingResource = undefined;

            document.querySelector(".controls #cancel-linking")!.classList.add("hidden");
            document.querySelector("#canvas-context-menu-container #cancel-linking-option")!.classList.add("hidden");

            this.dispatchEvent(new Event(MouseHandler.finishedConnectingSlotsEvent));
        }
    }

    public inputSlotClicked(event: MouseEvent, targetSlot: SankeySlotMissing)
    {
        if (this._mouseStatus === MouseHandler.MouseStatus.Free)
        {
            this._mouseStatus = MouseHandler.MouseStatus.ConnectingInputSlot;

            this.startConnectingSlot(event, targetSlot, true);

            Settings.instance.connectingResource = { type: "input", id: targetSlot.resourceId };
        }
        else if (this._mouseStatus === MouseHandler.MouseStatus.ConnectingOutputSlot)
        {
            if (this._firstConnectingSlot == undefined)
            {
                throw Error("First connecting slot wasn't saved.");
            }

            if (this._firstConnectingSlot.resourceId != targetSlot.resourceId)
            {
                return;
            }

            let resourcesAmount =
                Math.min(targetSlot.resourcesAmount, this._firstConnectingSlot.resourcesAmount);

            let newSlot1 = this._firstConnectingSlot.splitOffSlot(resourcesAmount);
            let newSlot2 = targetSlot.splitOffSlot(resourcesAmount);

            SankeyLink.connect(newSlot1, newSlot2);

            this.cancelConnectingSlots();
        }
    }

    public outputSlotClicked(event: MouseEvent, targetSlot: SankeySlotExceeding)
    {
        if (this._mouseStatus === MouseHandler.MouseStatus.Free)
        {
            this._mouseStatus = MouseHandler.MouseStatus.ConnectingOutputSlot;

            this.startConnectingSlot(event, targetSlot, false);

            Settings.instance.connectingResource = { type: "output", id: targetSlot.resourceId };
        }
        else if (this._mouseStatus === MouseHandler.MouseStatus.ConnectingInputSlot)
        {
            if (this._firstConnectingSlot == undefined)
            {
                throw Error("First connecting slot wasn't saved.");
            }

            if (this._firstConnectingSlot.resourceId != targetSlot.resourceId)
            {
                return;
            }

            let resourcesAmount =
                Math.min(targetSlot.resourcesAmount, this._firstConnectingSlot.resourcesAmount);

            let newSlot1 = this._firstConnectingSlot.splitOffSlot(resourcesAmount);
            let newSlot2 = targetSlot.splitOffSlot(resourcesAmount);

            SankeyLink.connect(newSlot1, newSlot2);

            this.cancelConnectingSlots();
        }
    }

    private dragNodeTo(position: Point)
    {
        if (this._draggedNode == undefined)
        {
            throw Error("Dragged node wasn't saved.");
        }

        let previousPos = this._draggedNode.position;

        let zoomScale = PanZoomConfiguration.context.getTransform().scale;

        let mousePosDelta: Point = {
            x: position.x - this._lastMousePos.x,
            y: position.y - this._lastMousePos.y
        };

        this._draggedNode.position = {
            x: previousPos.x + mousePosDelta.x / zoomScale,
            y: previousPos.y + mousePosDelta.y / zoomScale
        };

        this._lastMousePos.x = position.x;
        this._lastMousePos.y = position.y;
    }

    private startConnectingSlot(
        event: MouseEvent,
        firstSlot: SankeySlotExceeding | SankeySlotMissing,
        isInput: boolean)
    {
        this._firstConnectingSlot = firstSlot;

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

        this._slotConnectingCurve = Curve.fromTwoPoints(
            startPos,
            svgMousePos
        );

        let path = new SvgPathBuilder()
            .startAt(this._slotConnectingCurve.startPoint)
            .curve(this._slotConnectingCurve)
            .build();

        this._slotConnectingLine = SvgFactory.createSvgPath("link-hint");
        this._slotConnectingLine.classList.add(isInput ? "from-input" : "from-output");
        this._slotConnectingLine.setAttribute("d", path);

        this._viewport.appendChild(this._slotConnectingLine);

        document.querySelector(".controls #cancel-linking")!.classList.remove("hidden");
        document.querySelector("#canvas-context-menu-container #cancel-linking-option")!.classList.remove("hidden");

        this.dispatchEvent(new Event(MouseHandler.startedConnectingSlotsEvent));
    }

    public startDraggingNode(node: SankeyNode, position: Point)
    {
        if (this._mouseStatus === MouseHandler.MouseStatus.Free)
        {
            this._mouseStatus = MouseHandler.MouseStatus.DraggingNode;

            this._draggedNode = node;

            this._lastMousePos.x = position.x;
            this._lastMousePos.y = position.y;
        }
    }

    public get firstConnectingSlot()
    {
        return this._firstConnectingSlot;
    }

    public get mouseStatus()
    {
        return this._mouseStatus;
    }

    public static clientToCanvasPosition(clientPosition: Point): Point
    {
        let viewport = document.querySelector("#viewport") as SVGGElement;

        const domPoint = new DOMPointReadOnly(clientPosition.x, clientPosition.y);

        return domPoint.matrixTransform(viewport.getScreenCTM()!.inverse());
    }

    private constructor()
    {
        super();
    }

    private static _instance: MouseHandler | undefined;

    private _firstConnectingSlot: SankeySlotMissing | SankeySlotExceeding | undefined;
    private _draggedNode: SankeyNode | undefined;

    private _slotConnectingLine: SVGPathElement | undefined;
    private _slotConnectingCurve?: Curve;

    private _mouseStatus: MouseHandler.MouseStatus = MouseHandler.MouseStatus.Free;
    private _lastMousePos = new Point(0, 0);

    private readonly _viewport = document.querySelector("#viewport") as SVGGElement;
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
