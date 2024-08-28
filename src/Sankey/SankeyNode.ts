import { Point } from "../Geometry/Point";
import { SankeySlot } from "./Slots/SankeySlot";
import { SlotsGroup, SlotsGroupType } from "./SlotsGroup";
import { SvgFactory } from "../SVG/SvgFactory";
import { GameRecipe } from "../GameData/GameRecipe";
import { GameMachine } from "../GameData/GameMachine";
import { NodeContextMenu } from '../ContextMenu/NodeContextMenu';
import { NodeConfiguration } from './NodeConfiguration/NodeConfiguration';
import { overclockPower, toItemsInMinute } from '../GameData/GameData';
import { NodeResourceDisplay } from './NodeResourceDisplay';

export class SankeyNode extends EventTarget
{
    public static readonly resourcesAmountChangedEvent = "resources-amount-changed";
    public static readonly changedVacantResourcesAmountEvent = "changed-vacant-resources-amount";
    public static readonly deletionEvent = "deleted";

    public nodeSvg: SVGElement;
    public nodeSvgGroup: SVGGElement;
    public static readonly nodeWidth = 70;

    public constructor(
        position: Point,
        recipe: GameRecipe,
        machine: GameMachine,
    )
    {
        super();

        this._recipe = { ...recipe };
        this._machine = { ...machine };
        this._height = SankeyNode._nodeHeight;

        let sumResources = (sum: number, product: RecipeResource) =>
            sum + this.toItemsInMinute(product.amount);

        this._inputResourcesAmount = this._recipe.ingredients.reduce(sumResources, 0);
        this._outputResourcesAmount = this._recipe.products.reduce(sumResources, 0);

        this.nodeSvgGroup = SvgFactory.createSvgGroup({
            x: position.x - SankeyNode.nodeWidth / 2 - SankeySlot.slotWidth,
            y: position.y - this.height / 2
        }, "node", "animate-appearance");

        this.nodeSvg = SvgFactory.createSvgRect({
            width: SankeyNode.nodeWidth,
            height: this.height,
            x: SankeySlot.slotWidth,
            y: 0
        }, "machine");

        this._inputSlotGroups = this.createGroups("input", recipe.ingredients);
        this._outputSlotGroups = this.createGroups("output", recipe.products);

        this.configureContextMenu(recipe, machine);

        this._resourceDisplay = new NodeResourceDisplay(this, recipe, machine);
        this._resourceDisplay.setBounds({
            x: 10,
            y: 0,
            width: SankeyNode.nodeWidth,
            height: this.height
        });

        this.nodeSvgGroup.appendChild(this.nodeSvg);
        this._resourceDisplay.appendTo(this.nodeSvgGroup);

        document.querySelector("#viewport>g.nodes")!.appendChild(this.nodeSvgGroup);
    }

    public delete()
    {
        for (const slotsGroup of this._inputSlotGroups)
        {
            slotsGroup.delete();
        }

        for (const slotsGroup of this._outputSlotGroups)
        {
            slotsGroup.delete();
        }

        this.nodeSvgGroup.remove();

        this.dispatchEvent(new Event(SankeyNode.deletionEvent));
    }

    public get position(): Point
    {
        let transform = this.nodeSvgGroup.getAttribute("transform") ?? "translate(0, 0)";
        let transformRegex = /translate\((?<x>-?\d+(?:\.\d+)?), ?(?<y>-?\d+(?:\.\d+)?)\)/;

        let match = transformRegex.exec(transform)!;
        let { x, y } = match.groups!;

        return { x: +x, y: +y };
    }

    public set position(position: Point)
    {
        this.nodeSvgGroup.setAttribute("transform", `translate(${position.x}, ${position.y})`);

        for (const group of this._inputSlotGroups)
        {
            group.dispatchEvent(new Event(SlotsGroup.boundsChangedEvent));
        }

        for (const group of this._outputSlotGroups)
        {
            group.dispatchEvent(new Event(SlotsGroup.boundsChangedEvent));
        }
    }

    public get height(): number
    {
        return this._height;
    }

    public get missingResources(): RecipeResource[]
    {
        let result: RecipeResource[] = [];

        for (const slotsGroup of this._inputSlotGroups)
        {
            let amount = slotsGroup.vacantResourcesAmount;

            if (amount > 0)
            {
                result.push({ amount: amount, id: slotsGroup.resourceId });
            }
        }

        return result;
    }

    public get exceedingResources(): RecipeResource[]
    {
        let result: RecipeResource[] = [];

        for (const slotsGroup of this._outputSlotGroups)
        {
            let amount = slotsGroup.vacantResourcesAmount;

            if (amount > 0)
            {
                result.push({ amount: amount, id: slotsGroup.resourceId });
            }
        }

        return result;
    }

    public get powerConsumption(): number
    {
        let overclockedPower = overclockPower(
            this._machine.powerConsumption,
            this.overclockRatio,
            this._machine.powerConsumptionExponent
        );

        return overclockedPower * this.machinesAmount;
    }

    public get inputResourcesAmount(): number
    {
        return this._inputResourcesAmount;
    }

    private set inputResourcesAmount(inputResourcesAmount: number)
    {
        this._inputResourcesAmount = inputResourcesAmount;

        this.dispatchEvent(new Event(SankeyNode.resourcesAmountChangedEvent));
    }

    public get outputResourcesAmount(): number
    {
        return this._outputResourcesAmount;
    }

    private set outputResourcesAmount(outputResourcesAmount: number)
    {
        this._outputResourcesAmount = outputResourcesAmount;

        this.dispatchEvent(new Event(SankeyNode.resourcesAmountChangedEvent));
    }

    private configureContextMenu(recipe: GameRecipe, machine: GameMachine): void
    {
        let nodeContextMenu = new NodeContextMenu(this.nodeSvg);

        nodeContextMenu.addEventListener(NodeContextMenu.deleteNodeOptionClickedEvent, () =>
        {
            this.delete();
        });

        let configurator = new NodeConfiguration(recipe, machine);

        let openConfigurator = (event: Event) =>
        {
            configurator.openConfigurationWindow(this.machinesAmount, this.overclockRatio);
            event.stopPropagation();
        };

        nodeContextMenu.addEventListener(NodeContextMenu.configureNodeOptionClickedEvent, openConfigurator);
        this.nodeSvg.addEventListener("dblclick", openConfigurator);

        configurator.addEventListener(NodeConfiguration.configurationUpdatedEvent, () =>
        {
            this.machinesAmount = configurator.machinesAmount;
            this.overclockRatio = configurator.overclockRatio;
        });
    }

    private createGroups(type: SlotsGroupType, resources: RecipeResource[]): SlotsGroup[]
    {
        let result: SlotsGroup[] = [];
        let nextGroupY = 0;

        for (const resource of resources)
        {
            let newGroup = new SlotsGroup(
                this,
                type,
                { id: resource.id, amount: this.toItemsInMinute(resource.amount) },
                nextGroupY
            );

            result.push(newGroup);

            nextGroupY += newGroup.height;

            newGroup.addEventListener(SlotsGroup.changedVacantResourcesAmountEvent, () =>
                this.dispatchEvent(new Event(SankeyNode.changedVacantResourcesAmountEvent))
            );
        }

        return result;
    }

    private toItemsInMinute(amount: number)
    {
        return toItemsInMinute(amount, this._recipe.manufacturingDuration);
    }

    private multiplyResourcesAmount(multiplier: number)
    {
        this.inputResourcesAmount *= multiplier;
        this.outputResourcesAmount *= multiplier;

        for (const slotsGroup of this._inputSlotGroups)
        {
            slotsGroup.resourcesAmount *= multiplier;
        }

        for (const slotsGroup of this._outputSlotGroups)
        {
            slotsGroup.resourcesAmount *= multiplier;
        }
    }

    public get machinesAmount(): number
    {
        return this._machinesAmount;
    }

    private set machinesAmount(value: number)
    {
        let difference = value / this._machinesAmount;

        this._machinesAmount = value;

        this.multiplyResourcesAmount(difference);
    }

    public get overclockRatio(): number
    {
        return this._overclockRatio;
    }

    private set overclockRatio(value: number)
    {
        let difference = value / this._overclockRatio;

        this._overclockRatio = value;

        this.multiplyResourcesAmount(difference);
    }

    private _recipe: GameRecipe;
    private _machine: GameMachine;

    private _inputResourcesAmount: number;
    private _outputResourcesAmount: number;

    private _machinesAmount = 1;
    private _overclockRatio = 1;

    private _height: number;

    private _inputSlotGroups: SlotsGroup[] = [];
    private _outputSlotGroups: SlotsGroup[] = [];
    private _resourceDisplay: NodeResourceDisplay;

    private static readonly _nodeHeight = 280;
}
