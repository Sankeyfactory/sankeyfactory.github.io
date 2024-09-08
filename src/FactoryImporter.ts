import { AppData } from "./AppData";
import { LinkedFactory } from "./CustomData/LinkedFactory";
import { GameRecipe } from "./GameData/GameRecipe";
import { Recipe } from "./Recipe";

export class FactoryImporter extends EventTarget
{
    public static readonly factoryImportedEvent = "factory-imported";

    private static _instance = new FactoryImporter();

    public static get instance(): FactoryImporter
    {
        return FactoryImporter._instance;
    }

    public static importSavedFactory(factoryToImport: string): void
    {
        let pageCenter = {
            x: document.documentElement.clientWidth / 2,
            y: document.documentElement.clientHeight / 2
        };
        
        
        let encodedData = AppData.instance.getEncodedPlanFromDatabase(factoryToImport);
        let jsonData = atob(decodeURI(encodedData));

        // Process the factory string to get the inputs/outputs
        let data = AppData.getSerializableData(jsonData);
        let loadedFactoryNodes = data.nodes
        
        let resources = {
            "input": new Map<string, number>(),
            "output": new Map<string, number>(),
        }

        let powerConsumption = 0;
        loadedFactoryNodes.forEach((node) => 
        {
            let recipe: Recipe;
            switch (node.recipeType)
            {
                case "":
                case undefined:
                case "GameRecipe":
                    recipe = GameRecipe.fromSerializable(node.recipeId);
                    break;
                case "LinkedFactory":
                    recipe = LinkedFactory.fromSerializable(node.recipeId, node.customRecipe, node.customPower);
                    break;
                default:
                    throw Error("Unknown RecipeType [" + node.recipeType + "]");

            }
            let machine = recipe.getMachine();

            let opsPerMinute = (60.0 / recipe.manufacturingDuration)
            powerConsumption += machine.powerConsumption * node.machinesAmount;
            recipe.ingredients.forEach(ingredient => {
                let currentAmount = resources.input.get(ingredient.id) || 0
                let addedAmount = ingredient.amount * node.machinesAmount * opsPerMinute;
                resources.input.set(ingredient.id, currentAmount + addedAmount);
            });
            recipe.products.forEach(product => {
                let currentAmount = resources.output.get(product.id) || 0
                let addedAmount = product.amount * node.machinesAmount * opsPerMinute;
                resources.output.set(product.id, currentAmount + addedAmount);
                // Remove resources from overall Inputs/Outputs if this output is supplying an input.
                node.outputsGroups.forEach(outputGroup => 
                {
                    let resourceId = outputGroup.resourceId;
                    outputGroup.connectedOutputs.forEach(connectedOutput => 
                    {
                        let currentInputAmount = resources.input.get(resourceId) || 0
                        resources.input.set(resourceId, currentInputAmount - connectedOutput.resourcesAmount);
                        let currentOutputAmount = resources.output.get(resourceId) || 0
                        resources.output.set(resourceId, currentOutputAmount - connectedOutput.resourcesAmount);
                    })
                })
            });
        })

        let factoryRecipe = new LinkedFactory(
            factoryToImport,
            factoryToImport,
            Array.from(resources.input).filter(([key, value]) => value > 0).map(([key, value]) => ({ "id": key, "amount": value })),
            Array.from(resources.output).filter(([key, value]) => value > 0).map(([key, value]) => ({ "id": key, "amount": value })),
            powerConsumption
        )
        let detail = { recipe: factoryRecipe, machine: factoryRecipe.getMachine() };
        const importFactoryEvent = new CustomEvent(FactoryImporter.factoryImportedEvent, { detail: detail});
        FactoryImporter._instance.dispatchEvent(importFactoryEvent);
    }
}