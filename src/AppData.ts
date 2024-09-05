import { SankeyNode } from "./Sankey/SankeyNode";

export class AppData extends EventTarget
{
    public static readonly dataLoadedEvent = "data-loaded";
    public static readonly databasePlanSelectionChangedEvent = "database-plan-selection-changed";

    public static get instance(): AppData
    {
        return AppData._instance;
    }

    public loadFromUrl()
    {
        this._database = AppData.fetchDatabase();

        let dataEncoded = location.hash.slice(1);

        if (dataEncoded === "")
        {
            this.loadDatabasePlan(this.currentPlanName);
        }
        else
        {
            this.currentPlanName = this.getDatabasePlanName(dataEncoded);
            this.loadFromEncoded(dataEncoded);
        }
    }

    public save()
    {
        if (this._savingLocks === 0)
        {
            let dataEncoded;

            if (this.nodes.length === 0)
            {
                dataEncoded = "";
            }
            else
            {
                let savedData = this.serialize();
                dataEncoded = encodeURI(btoa(savedData));
            }

            this.saveToUrl(dataEncoded);
            this.saveToDatabasePlan(this.currentPlanName, dataEncoded);
        }
    }

    public lockSaving()
    {
        ++this._savingLocks;
    }

    public unlockSaving()
    {
        --this._savingLocks;
    }

    public deleteAllNodes(): void 
    {
        AppData.instance.lockSaving();

        while (this._nodes.length !== 0)
        {
            this._nodes.at(-1)!.delete();
        }

        SankeyNode.setNextId(0);

        AppData.instance.unlockSaving();
    }

    public addNode(node: SankeyNode)
    {
        this._nodes.push(node);

        node.addEventListener(SankeyNode.deletionEvent, () =>
        {
            let index = this._nodes.findIndex(registeredNode => Object.is(node, registeredNode));

            this._nodes.splice(index, 1);
        });

        this.save();
    }

    public loadDatabasePlan(planName: string): void
    {
        this.currentPlanName = planName;

        for (const dbPlanName in this._database.plans)
        {
            let dataEncoded = this._database.plans[planName];

            if (dbPlanName === planName)
            {
                this.loadFromEncoded(dataEncoded);
                return;
            }
        }

        if (planName !== "")
        {
            // If suitable plan wasn't found, load the "None" one.
            this.loadDatabasePlan("");
        }
    }

    public deleteDatabasePlan(planName: string)
    {
        delete (this._database.plans[planName]);

        if (this.currentPlanName === planName)
        {
            this.loadDatabasePlan("");
        }

        AppData.pushToDatabase(this._database);
    }

    public createAndSelectDatabasePlan(planName: string)
    {
        let dataEncoded = this._database.plans[this.currentPlanName] ?? "";

        this.saveToDatabasePlan(planName, dataEncoded);

        this.currentPlanName = planName;
    }

    public get nodes(): SankeyNode[]
    {
        return this._nodes;
    }

    public get databasePlanNames(): string[]
    {
        return Object.keys(this._database.plans);
    }

    public get currentPlanName(): string
    {
        return this._database.currentPlan;
    }

    private serialize(): string
    {
        let data: AppData.SerializableData = { nodes: [] };

        for (const node of this._nodes)
        {
            data.nodes.push(node.toSerializable());
        }

        return JSON.stringify(AppData.objToArray(data));
    }

    private saveToUrl(dataEncoded: string): void
    {
        location.hash = dataEncoded;
    }

    private loadFromJson(json: string)
    {
        let parsedJson: any[] = JSON.parse(json);

        let data = AppData.dataFromArray(parsedJson);

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

    private loadFromEncoded(dataEncoded: string): void
    {
        this.deleteAllNodes();

        if (dataEncoded === "")
        {
            return;
        }

        let savedData = atob(decodeURI(dataEncoded));

        this.lockSaving();

        this.loadFromJson(savedData);

        this.dispatchEvent(new Event(AppData.dataLoadedEvent));

        this.unlockSaving();

        this.saveToUrl(dataEncoded);
    }

    private saveToDatabasePlan(planName: string, dataEncoded: string): void
    {
        this._database.plans[planName] = dataEncoded;
        AppData.pushToDatabase(this._database);
    }

    private getDatabasePlanName(dataEncoded: string)
    {
        let suitableName = "";

        for (const planName in this._database.plans)
        {
            if (planName === "") continue;

            if (dataEncoded === this._database.plans[planName])
            {
                if (suitableName === "")
                {
                    suitableName = planName;
                }
                else
                {
                    // If there are two or more plans with the same data, we can't decide which
                    // one is more suitable.
                    return "";
                }
            }
        }

        return suitableName;
    }

    private set currentPlanName(planName: string)
    {
        this._database.currentPlan = planName;

        this.dispatchEvent(new Event(AppData.databasePlanSelectionChangedEvent));

        AppData.pushToDatabase(this._database);
    }

    private static fetchDatabase(): AppData.Database
    {
        let database: AppData.Database;

        let localStorageDatabase = localStorage.getItem("sankeyfactory-database");

        if (localStorageDatabase != null)
        {
            database = JSON.parse(localStorageDatabase) as AppData.Database;
        }
        else
        {
            database = { ...this._defaultDatabase };
        }

        return database;
    }

    private static pushToDatabase(data: AppData.Database)
    {
        localStorage.setItem("sankeyfactory-database", JSON.stringify(data));
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

    private static _instance = new AppData();

    private _nodes: SankeyNode[] = [];

    private _savingLocks = 0;

    private static _defaultDatabase: AppData.Database = { currentPlan: "", plans: {} };
    private _database: AppData.Database = { ...AppData._defaultDatabase };
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

export namespace AppData
{
    export type Database = {
        currentPlan: string,
        plans: Record<string, string>,
    };
};
