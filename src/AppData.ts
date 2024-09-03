import { SankeyNode } from "./Sankey/SankeyNode";

export class AppData extends EventTarget
{
    public static onDataLoad: () => void;

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
        this.deleteAllNodes();

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

        this.onDataLoad();
    }

    public static loadFromUrl()
    {
        let dataEncoded = location.hash.slice(1);
        let dataEncodedFromStorage = this.loadFromLocalStorage();

        if (dataEncoded == ``) {
            dataEncoded = dataEncodedFromStorage;
            location.hash = dataEncoded;
        } 

        if (dataEncoded == ``) return;

        let savedData = atob(decodeURI(dataEncoded));

        this.lockSaving();

        AppData.deserialize(savedData);

        this.unlockSaving();
    }

    public static saveToUrl()
    {
        if (this._savingLocks === 0)
        {
            if (AppData.nodes.length === 0)
            {
                location.hash = "";
                return;
            }

            let savedData = AppData.serialize();

            let dataEncoded = encodeURI(btoa(savedData));
            this.saveToLocalStorage(dataEncoded);

            location.hash = dataEncoded;
        }
    }

    private static saveToLocalStorage(data: string) {
        localStorage.setItem('saveState', data);
      }
    
      static loadFromLocalStorage(): string {
        return localStorage.getItem('saveState') ?? '';
      }

    public static lockSaving()
    {
        ++this._savingLocks;
    }

    public static unlockSaving()
    {
        --this._savingLocks;
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

    public static deleteAllNodes(): void 
    {
        while (this._nodes.length !== 0)
        {
            this._nodes.at(-1)!.delete();
        }
    }

    public static addNode(node: SankeyNode)
    {
        this._nodes.push(node);

        node.addEventListener(SankeyNode.deletionEvent, () =>
        {
            let index = this._nodes.findIndex(registeredNode => Object.is(node, registeredNode));

            this._nodes.splice(index, 1);
        });

        this.saveToUrl();
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

    private static _savingLocks = 0;
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
