import { AppData } from "./AppData";

export class FactoryStorage
{
    private static _instance: FactoryStorage;
    private database : IDBDatabase | null = null;
    private savedFactories: Map<string, string> = new Map()

    public static get instance()
    {
        return this._instance;
    }

    private processSavedFactory(factoryName: string, encodedString: string): void
    {
        this.savedFactories.set(factoryName, encodedString);
    }

    private setDatabase(database: IDBDatabase): void
    {
        this.database = database;
    }

    private constructor(onDbLoaded: () => void)
    {
        let factoryDbRequest = window.indexedDB.open("SankeyDB", 1)
        factoryDbRequest.addEventListener("onerror", (event) =>
        {
            throw Error(`Error accessing IndexDB` + factoryDbRequest.error);
        })

        factoryDbRequest.onupgradeneeded = function(event) {
            let db = factoryDbRequest.result;
            switch(event.oldVersion) { // existing db version
                case 0:
                // version 0 means that the client had no database
                // perform initialization
                db.createObjectStore("SavedFactories", {keyPath: "factoryName"})
            }
        }
        factoryDbRequest.onsuccess = function() {
            let storageInstance = FactoryStorage.instance;
            storageInstance.setDatabase(factoryDbRequest.result)

            let transaction = this.result.transaction("SavedFactories", "readonly");
            let savedFactories = transaction.objectStore("SavedFactories");
            let request = savedFactories.openCursor();
            
            request.onsuccess = function() {
                let cursor = request.result
                if (cursor)
                {
                    storageInstance.processSavedFactory(cursor.key.toString(), cursor.value.serializedData)
                    cursor.continue();
                }
                else
                {
                    onDbLoaded();
                }
            };
            
            request.onerror = function() {
                throw Error("Error Reading Factories: " + request.error);
            };   
        }
    }

    public getFactoryNameFromHash(): string
    {
        let dataEncoded = location.hash.slice(1);
        let matchedValue = ""
        if (dataEncoded !== '')
        {
            // Try to find a matching value from our DB
            this.savedFactories.forEach((value, key) => {
                let thisEncoded = encodeURI(btoa(value));
                if (thisEncoded == dataEncoded)
                {
                    matchedValue = key;
                    return;
                }
            })
        }
        // Otherwise, set the dropdown to the "Save New Factory" option.
        return matchedValue;
    }

    public saveFactory(name: string, onSuccessCallback: () => void): void
    {
        if (this.database === null)
        {
            throw Error(`Error saving, database is not initialized`);
        }
        let transaction = this.database.transaction("SavedFactories", "readwrite");
        let savedFactories = transaction.objectStore("SavedFactories");
        let serializedData = AppData.serialize();
        let factory = {
            "factoryName": name,
            "serializedData": serializedData
        }
        let request = savedFactories.put(factory);
        request.onsuccess = function() {
            // Update our in-mem data
            FactoryStorage.instance.processSavedFactory(name, serializedData);
            onSuccessCallback();
        };
        
        request.onerror = function() {
            throw Error("Error Saving: " + request.error);
        };
    }

    public loadFactory(factoryName: string, onSuccessCallback: (savedData: string) => void): void
    {
        let loadedData = this.savedFactories.get(factoryName);
        if (typeof loadedData === 'undefined')
        {
            throw Error("Error Loading Factory, could not find a factory with that name");
        }
        onSuccessCallback(loadedData);
    }

    public deleteSavedFactory(factoryName: string): void
    {
        // Remove from Database
        if (this.database === null)
        {
            throw Error(`Error deleting, database is not initialized`);
        }
        let transaction = this.database.transaction("SavedFactories", "readwrite");
        let savedFactories = transaction.objectStore("SavedFactories");
        let request = savedFactories.delete(factoryName);
        request.onsuccess = function() {
            // Update our in-mem data
            FactoryStorage.instance.savedFactories.delete(factoryName);
        };
        
        request.onerror = function() {
            throw Error("Error Deleting: " + request.error);
        };

    }

    public getSavedFactoryNames(): string[]
    {
        return Array.from(this.savedFactories.keys())
    }

    public static initStorage(onDbLoaded: () => void): void
    {
        if (typeof FactoryStorage._instance === 'undefined')
        {
            FactoryStorage._instance = new FactoryStorage(onDbLoaded);
        }
    }    
}
