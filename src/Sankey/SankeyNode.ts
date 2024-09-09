import { Point } from "../Geometry/Point";
import { SankeySlot } from "./Slots/SankeySlot";
import { SlotsGroup, SlotsGroupType } from "./SlotsGroup";
import { SvgFactory } from "../SVG/SvgFactory";
import { GameRecipe } from "../GameData/GameRecipe";
import { GameMachine } from "../GameData/GameMachine";
import { NodeContextMenu } from '../ContextMenu/NodeContextMenu';
import { NodeConfiguration } from './NodeConfiguration/NodeConfiguration';
import { loadSatisfactoryRecipe, overclockPower, overclockToShards, toItemsInMinute } from '../GameData/GameData';
import { NodeResourceDisplay } from './NodeResourceDisplay';
import { CanvasGrid } from "../CanvasGrid";
import { Settings } from "../Settings";
import { AppData } from "../DataSaves/AppData";
import { SankeyLink } from "./SankeyLink";

export class SankeyNode extends EventTarget
{
    public static readonly resourcesAmountChangedEvent = "resources-amount-changed";
    public static readonly changedVacantResourcesAmountEvent = "changed-vacant-resources-amount";
    public static readonly deletionEvent = "deleted";

    public nodeSvg: SVGElement;
    public nodeSvgGroup: SVGGElement;
    public static readonly nodeWidth = 80;

    public readonly id: number;

    public constructor(
        position: Point,
        recipe: GameRecipe,
        machine: GameMachine,
    )
    {
        super();

        this.id = SankeyNode.acquireId();
        this._recipe = { ...recipe };
        this._machine = { ...machine };
        this._height = SankeyNode._nodeHeight;

        let sumResources = (sum: number, product: RecipeResource) =>
            sum + this.toItemsInMinute(product.amount);

        this._inputResourcesAmount = this._recipe.ingredients.reduce(sumResources, 0);
        this._outputResourcesAmount = this._recipe.products.reduce(sumResources, 0);

        this.nodeSvgGroup = SvgFactory.createSvgGroup(new Point(0, 0), "node", "animate-appearance");

        this.centerPosition = position;

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
        AppData.instance.lockSaving();

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

        AppData.instance.unlockSaving();

        AppData.instance.save();
    }

    public toSerializable(): AppData.SerializableNode
    {
        let outputGroups: AppData.SerializableSlotsGroup[] = [];

        for (const group of this._outputSlotGroups)
        {
            outputGroups.push(group.toSerializable());
        }

        let position = { ...this.position };

        if (Settings.instance.isGridEnabled)
        {
            position = CanvasGrid.alignPoint(position);
        }

        let serializable: AppData.SerializableNode = {
            id: this.id,
            recipeId: this._recipe.id,
            machinesAmount: this.machinesAmount,
            overclockRatio: this.overclockRatio,
            positionX: position.x,
            positionY: position.y,
            outputsGroups: outputGroups,
        };

        return serializable;
    }

    public static fromSerializable(serializable: AppData.SerializableNode): SankeyNode
    {
        let recipe = loadSatisfactoryRecipe(serializable.recipeId);

        let node = new SankeyNode(
            { x: serializable.positionX, y: serializable.positionY },
            recipe.recipe,
            recipe.machine,
        );

        node.position = { x: serializable.positionX, y: serializable.positionY };

        node.machinesAmount = serializable.machinesAmount;
        node.overclockRatio = serializable.overclockRatio;

        return node;
    }

    public connectDeserializedSlots(
        serializable: AppData.SerializableNode,
        nodeIds: Map<number, SankeyNode>)
    {
        for (const group of serializable.outputsGroups)
        {
            for (const slot of group.connectedOutputs)
            {
                let destinationNode = nodeIds.get(slot.connectedTo);

                if (destinationNode == undefined)
                {
                    throw Error(`Error loading connected slot`);
                }

                let first = this.addOutputSlot(group.resourceId, slot.resourcesAmount);
                let second = destinationNode.addInputSlot(group.resourceId, slot.resourcesAmount);

                SankeyLink.connect(first, second);
            }
        }
    }

    public get recipe()
    {
        return this._recipe;
    }

    public addInputSlot(resourceId: string, resourcesAmount: number): SankeySlot
    {
        let inputGroup = this._inputSlotGroups.find(
            inGroup => inGroup.resourceId === resourceId
        );

        if (inputGroup == undefined)
        {
            throw Error(`Error finding group with ${resourceId}`);
        }

        return inputGroup.addSlot(resourcesAmount);
    }

    public addOutputSlot(resourceId: string, resourcesAmount: number): SankeySlot
    {
        let outputGroup = this._outputSlotGroups.find(
            outGroup => outGroup.resourceId === resourceId
        );

        if (outputGroup == undefined)
        {
            throw Error(`Error finding group with ${resourceId}`);
        }

        return outputGroup.addSlot(resourcesAmount);
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

        for (const group of this._inputSlotGroups)
        {
            group.dispatchEvent(new Event(SlotsGroup.boundsChangedEvent));
        }

        for (const group of this._outputSlotGroups)
        {
            group.dispatchEvent(new Event(SlotsGroup.boundsChangedEvent));
        }
    }

    public set centerPosition(position: Point)
    {
        this.position = {
            x: position.x - SankeyNode.nodeWidth / 2 - SankeySlot.slotWidth,
            y: position.y - this.height / 2,
        };
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

    public get requiredPowerShards(): number
    {
        return overclockToShards(this.overclockRatio);
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

    public get inputSlotGroups()
    {
        return this._inputSlotGroups;
    }

    public get outputSlotGroups()
    {
        return this._outputSlotGroups;
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

            AppData.instance.save();
        });
    }

    private createGroups(type: SlotsGroupType, resources: RecipeResource[]): SlotsGroup[]
    {
        let result: SlotsGroup[] = [];
        let nextGroupY = 0;

        let addGroup = (group: SlotsGroup) =>
        {
            result.push(group);

            nextGroupY += group.height;

            group.addEventListener(SlotsGroup.changedVacantResourcesAmountEvent, () =>
                this.dispatchEvent(new Event(SankeyNode.changedVacantResourcesAmountEvent))
            );
        };

        if (type === "output" && this.recipe.producedPower != undefined)
        {
            addGroup(new SlotsGroup(
                this,
                type,
                { id: "Power", amount: this.recipe.producedPower },
                nextGroupY
            ));
        }

        for (const resource of resources)
        {
            addGroup(new SlotsGroup(
                this,
                type,
                { id: resource.id, amount: this.toItemsInMinute(resource.amount) },
                nextGroupY
            ));
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

    public set machinesAmount(value: number)
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

    private static acquireId(): number
    {
        return SankeyNode._nextId++;
    }

    public static setNextId(nextId: number): void
    {
        SankeyNode._nextId = nextId;
    }

    private _recipe: GameRecipe;
    private _machine: GameMachine;

    private _inputResourcesAmount: number;
    private _outputResourcesAmount: number;

    private _machinesAmount = 1;
    private _overclockRatio = 1;

    private _height: number;
    private _position = new Point(0, 0);

    private _inputSlotGroups: SlotsGroup[] = [];
    private _outputSlotGroups: SlotsGroup[] = [];
    private _resourceDisplay: NodeResourceDisplay;

    private static _nextId = 0;

    private static readonly _nodeHeight = 300;
}
