// Ignore import error as the file only appears on launch of the exporting tool.
// @ts-ignore
import satisfactoryData from '../../dist/GameData/Satisfactory.json';

import { PanZoom } from "panzoom";
import { Curve } from "../Curve";
import { Rectangle } from "../Rectangle";
import { SvgFactory } from "../SVG/SvgFactory";
import { SvgPathBuilder } from "../SVG/SvgPathBuilder";
import { SankeySlot } from "./Slots/SankeySlot";
import { Point } from '../Point';

export class SankeyLink
{
    public static connect(firstSlot: SankeySlot, secondSlot: SankeySlot, panContext: PanZoom) 
    {
        let link = new SankeyLink(firstSlot, secondSlot, panContext);

        let linksGroup = document.querySelector("#viewport>g.links")!;

        linksGroup.appendChild(link._svgPath);
        linksGroup.appendChild(link._resourceDisplay);
    }

    constructor(firstSlot: SankeySlot, secondSlot: SankeySlot, panContext: PanZoom)
    {
        this._firstSlot = firstSlot;
        this._secondSlot = secondSlot;
        this._panContext = panContext;

        firstSlot.addEventListener(SankeySlot.boundsChangedEvent, this.recalculate.bind(this));
        secondSlot.addEventListener(SankeySlot.boundsChangedEvent, this.recalculate.bind(this));

        this._svgPath = SvgFactory.createSvgPath("link");

        this._resourceDisplay = this.createResourceDisplay({
            id: firstSlot.resourceId,
            amount: firstSlot.resourcesAmount
        });

        this.recalculate();
    }

    public recalculate(): void
    {
        /* Placing link svg path */

        let first = Rectangle.fromSvgBounds(this._firstSlot.slotSvgRect, this._panContext);
        let second = Rectangle.fromSvgBounds(this._secondSlot.slotSvgRect, this._panContext);

        let curve1 = Curve.fromTwoPoints(
            { x: first.x + first.width, y: first.y },
            { x: second.x, y: second.y }
        );

        let curve2 = Curve.fromTwoPoints(
            { x: second.x, y: second.y + second.height },
            { x: first.x + first.width, y: first.y + first.height },
        );

        let svgPath = new SvgPathBuilder()
            .startAt(curve1.startPoint)
            .curve(curve1)
            .verticalLineTo(curve1.endPoint.y + second.height)
            .curve(curve2)
            .verticalLineTo(curve1.startPoint.y)
            .build();

        this._svgPath.setAttribute("d", svgPath);

        // For cutting-out stroke on the outside of the shape.
        this._svgPath.style.clipPath = `view-box path("${svgPath}")`;

        /* Placing resource display */

        let avgHeight = first.height / 2 + second.height / 2;

        let minSize = 50;
        let maxSize = 90;
        let resourceDisplaySize = Math.max(minSize, Math.min(maxSize, avgHeight - 16));

        let middlePoint: Point = {
            x: curve1.startDeviationPoint.x,
            y: (curve1.startPoint.y + curve1.endPoint.y) / 2 + avgHeight / 2,
        };

        this._resourceDisplay.setAttribute("x", `${middlePoint.x - resourceDisplaySize / 2}`);
        this._resourceDisplay.setAttribute("y", `${middlePoint.y - resourceDisplaySize / 2}`);
        this._resourceDisplay.setAttribute("width", `${resourceDisplaySize}`);
        this._resourceDisplay.setAttribute("height", `${resourceDisplaySize}`);

        let amountText = this._resourceDisplay.querySelector("div.resource-amount") as HTMLDivElement;
        amountText.style.fontSize = `${(resourceDisplaySize / maxSize) * 18}px`;
    }

    public createResourceDisplay(resource: RecipeResource): SVGForeignObjectElement
    {
        let foreignObject = SvgFactory.createSvgForeignObject("resource-display");

        let container = document.createElement("div");
        container.classList.add("container");

        let icon = document.createElement("img");
        icon.classList.add("icon");

        let resourceDesc = satisfactoryData.resources.find(resourceDesc => resourceDesc.id == resource.id);

        if (resourceDesc != undefined)
        {
            icon.src = `GameData/SatisfactoryIcons/${resourceDesc.iconPath}`;
            icon.alt = resourceDesc.displayName;
        }

        let resourceAmount = document.createElement("div");
        resourceAmount.classList.add("resource-amount");
        resourceAmount.innerText = `${resource.amount}/min`;

        container.appendChild(icon);
        container.appendChild(resourceAmount);
        foreignObject.appendChild(container);

        return foreignObject;
    }

    private _firstSlot: SankeySlot;
    private _secondSlot: SankeySlot;
    private _panContext: PanZoom;
    private _svgPath: SVGPathElement;

    private _resourceDisplay: SVGForeignObjectElement;
}
