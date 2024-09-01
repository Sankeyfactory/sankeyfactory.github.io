import { Point } from "../Geometry/Point";
import { SankeySlot } from "./Slots/SankeySlot";
import { SlotsGroup, SlotsGroupType } from "./SlotsGroup";
import { SvgFactory } from "../SVG/SvgFactory";
import { GameRecipe } from "../GameData/GameRecipe";
import { GameMachine } from "../GameData/GameMachine";
import { NodeContextMenu } from '../ContextMenu/NodeContextMenu';
import { NodeConfiguration } from './NodeConfiguration/NodeConfiguration';
import { overclockPower, overclockToShards, toItemsInMinute } from '../GameData/GameData';
import { NodeResourceDisplay } from './NodeResourceDisplay';
import { CanvasGrid } from "../CanvasGrid";
import { Settings } from "../Settings";

export class SankeyNode extends EventTarget
{
    public static readonly resourcesAmountChangedEvent = "resources-amount-changed";
    public static readonly changedVacantResourcesAmountEvent = "changed-vacant-resources-amount";
    public static readonly deletionEvent = "deleted";
    public static readonly positionChangedEvent = "position-changed";
    public static readonly overclockRatioChangedEvent = "overclock-ratio-changed";
    public static readonly machinesAmountChangedEvent = "machines-amount-canged";
    public static readonly connectionsChangedEvent = "connections-changed";

    public static readonly nodeWidth = 80;

    public readonly id: number;
    public readonly nodeSvg: SVGElement;
    public readonly nodeSvgGroup: SVGGElement;
    public readonly inputSlotGroups: SlotsGroup[] = [];
    public readonly outputSlotGroups: SlotsGroup[] = [];
    public readonly recipe: GameRecipe;

    public constructor(
        id: number,
        position: Point,
        recipe: GameRecipe,
        machine: GameMachine,
    )
    {
        super();

        this.recipe = { ...recipe };
        this._machine = { ...machine };
        this._height = SankeyNode._nodeHeight;

        let sumResources = (sum: number, product: RecipeResource) =>
            sum + this.toItemsInMinute(product.amount);

        this._inputResourcesAmount = this.recipe.ingredients.reduce(sumResources, 0);
        this._outputResourcesAmount = this.recipe.products.reduce(sumResources, 0);

        this.nodeSvgGroup = SvgFactory.createSvgGroup(new Point(0, 0), "node", "animate-appearance");

        this.id = id;

        this.position = {
            x: position.x - SankeyNode.nodeWidth / 2 - SankeySlot.slotWidth,
            y: position.y - this.height / 2
        };

        this.nodeSvg = SvgFactory.createSvgRect({
            width: SankeyNode.nodeWidth,
            height: this.height,
            x: SankeySlot.slotWidth,
            y: 0
        }, "machine");

        this.inputSlotGroups = this.createGroups("input", recipe.ingredients);
        this.outputSlotGroups = this.createGroups("output", recipe.products);

        this.configureContextMenu(recipe, machine);

        this._resourceDisplay = new NodeResourceDisplay(this, recipe, machine);
        this._resourceDisplay.setBounds({
            x: SankeySlot.slotWidth,
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
        for (const slotsGroup of this.inputSlotGroups)
        {
            slotsGroup.delete();
        }

        for (const slotsGroup of this.outputSlotGroups)
        {
            slotsGroup.delete();
        }

        this.nodeSvgGroup.remove();

        this.dispatchEvent(new Event(SankeyNode.deletionEvent));
    }

    public get position(): Point
    {
        return this._position;
    }

    public set position(position: Point)
    {
        this._position = { ...position };

        if (Settings.instance.isGridEnabled)
        {
            position = CanvasGrid.alignPoint(position);
        }

        this.nodeSvgGroup.setAttribute("transform", `translate(${position.x}, ${position.y})`);

        for (const group of this.inputSlotGroups)
        {
            group.dispatchEvent(new Event(SlotsGroup.boundsChangedEvent));
        }

        for (const group of this.outputSlotGroups)
        {
            group.dispatchEvent(new Event(SlotsGroup.boundsChangedEvent));
        }

        this.dispatchEvent(new Event(SankeyNode.positionChangedEvent));
    }

    public get height(): number
    {
        return this._height;
    }

    public get missingResources(): RecipeResource[]
    {
        let result: RecipeResource[] = [];

        for (const slotsGroup of this.inputSlotGroups)
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

        for (const slotsGroup of this.outputSlotGroups)
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

    public get requiredPowerShards(): number
    {
        return overclockToShards(this.overclockRatio);
    }

    public get inputResourcesAmount(): number
    {
        return this._inputResourcesAmount;
    }

    public set inputResourcesAmount(inputResourcesAmount: number)
    {
        this._inputResourcesAmount = inputResourcesAmount;

        this.dispatchEvent(new Event(SankeyNode.resourcesAmountChangedEvent));
    }

    public get outputResourcesAmount(): number
    {
        return this._outputResourcesAmount;
    }

    public set outputResourcesAmount(outputResourcesAmount: number)
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
        return toItemsInMinute(amount, this.recipe.manufacturingDuration);
    }

    private multiplyResourcesAmount(multiplier: number)
    {
        this.inputResourcesAmount *= multiplier;
        this.outputResourcesAmount *= multiplier;

        for (const slotsGroup of this.inputSlotGroups)
        {
            slotsGroup.resourcesAmount *= multiplier;
        }

        for (const slotsGroup of this.outputSlotGroups)
        {
            slotsGroup.resourcesAmount *= multiplier;
        }
    }

    public get machinesAmount(): number
    {
        return this._machinesAmount;
    }

    public set machinesAmount(value: number)
    {
        let difference = value / this._machinesAmount;

        this._machinesAmount = value;

        this.multiplyResourcesAmount(difference);

        this.dispatchEvent(new Event(SankeyNode.machinesAmountChangedEvent));
    }

    public get overclockRatio(): number
    {
        return this._overclockRatio;
    }

    public set overclockRatio(value: number)
    {
        let difference = value / this._overclockRatio;

        this._overclockRatio = value;

        this.multiplyResourcesAmount(difference);

        this.dispatchEvent(new Event(SankeyNode.overclockRatioChangedEvent));
    }

    private _machine: GameMachine;

    private _inputResourcesAmount: number;
    private _outputResourcesAmount: number;

    private _machinesAmount = 1;
    private _overclockRatio = 1;

    private _height: number;
    private _position = new Point(0, 0);

    private _resourceDisplay: NodeResourceDisplay;

    private static readonly _nodeHeight = 300;
}
