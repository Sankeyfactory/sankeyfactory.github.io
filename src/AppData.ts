import { SankeyNode } from "./Sankey/SankeyNode";

export class AppData
{
    public static serialize(): string
    {
        let data: AppData.SerializableData = { nodes: [] };

        for (const node of this._nodes)
        {
            data.nodes.push(node.toSerializable());
        }

        return JSON.stringify(AppData.objToArray(data));
    }

    public static deserialize(json: string)
    {
        while (this._nodes.length !== 0)
        {
            this._nodes.at(-1)!.delete();
        }

        let parsedJson: any[] = JSON.parse(json);

        let data = this.dataFromArray(parsedJson);

        let nodeIds = new Map<number, SankeyNode>();

        for (const node of data.nodes)
        {
            let newNode = SankeyNode.fromSerializable(node);

            this.addNode(newNode);
            nodeIds.set(node.id, newNode);
        }

        for (let nodeIndex = 0; nodeIndex < this._nodes.length; ++nodeIndex)
        {
            this._nodes[nodeIndex].connectDeserializedSlots(data.nodes[nodeIndex], nodeIds);
        }
    }

    private static dataFromArray(array: any[]): AppData.SerializableData
    {
        let defaultData: AppData.SerializableData = {
            nodes: [],
        };

        let defaultNode: AppData.SerializableNode = {
            id: 0,
            recipeId: "",
            machinesAmount: 1,
            overclockRatio: 1,
            positionX: 0,
            positionY: 0,
            outputsGroups: [],
        };

        let defaultGroup: AppData.SerializableSlotsGroup = {
            resourceId: "",
            connectedOutputs: [],
        };

        let defaultSlot: AppData.SerializableConnectedSlot = {
            connectedTo: -1,
            resourcesAmount: 0,
        };

        let data = this.objFromArray(array, defaultData);

        for (let nodeIndex = 0; nodeIndex < data.nodes.length; ++nodeIndex)
        {
            data.nodes[nodeIndex]
                = this.objFromArray(data.nodes[nodeIndex] as unknown as any[], defaultNode);

            for (let groupIndex = 0; groupIndex < data.nodes[nodeIndex].outputsGroups.length; ++groupIndex)
            {
                data.nodes[nodeIndex].outputsGroups[groupIndex]
                    = this.objFromArray(data.nodes[nodeIndex].outputsGroups[groupIndex] as unknown as any[], defaultGroup);

                for (let slotIndex = 0; slotIndex < data.nodes[nodeIndex].outputsGroups[groupIndex].connectedOutputs.length; ++slotIndex)
                {
                    data.nodes[nodeIndex].outputsGroups[groupIndex].connectedOutputs[slotIndex]
                        = this.objFromArray(data.nodes[nodeIndex].outputsGroups[groupIndex].connectedOutputs[slotIndex] as unknown as any[], defaultSlot);
                }
            }
        }

        return data;
    }

    public static addNode(node: SankeyNode)
    {
        this._nodes.push(node);

        node.addEventListener(SankeyNode.deletionEvent, () =>
        {
            let index = this._nodes.findIndex(registeredNode => Object.is(node, registeredNode));

            this._nodes.splice(index, 1);
        });
    }

    public static get nodes(): SankeyNode[]
    {
        return this._nodes;
    }

    private static objToArray(obj: any)
    {
        return Object.keys(obj).map(function (property): any
        {
            let prop = obj[property];

            if (prop !== Object(prop))
            {
                return prop;
            }
            else
            {
                return AppData.objToArray(prop);
            }
        });
    };

    private static objFromArray<T extends object>(array: any[], defaultValue: T): T
    {
        let result: T = { ...defaultValue };
        let propIndex = 0;

        Object.keys(result).map(function (property)
        {
            result[property as keyof typeof result] = array[propIndex++];
        });

        return result;
    };

    private static _nodes: SankeyNode[] = [];
}

// Don't change positions and types of existing properties!
// Append the new ones only to the end!
export namespace AppData
{
    export type SerializableData = {
        nodes: SerializableNode[];
    };

    export type SerializableConnectedSlot = {
        connectedTo: number,

        resourcesAmount: number,
    };

    export type SerializableSlotsGroup = {
        resourceId: string,

        connectedOutputs: SerializableConnectedSlot[],
    };

    export type SerializableNode = {
        id: number,

        recipeId: string,

        machinesAmount: number,
        overclockRatio: number,

        positionX: number,
        positionY: number,

        outputsGroups: SerializableSlotsGroup[],
    };
};
