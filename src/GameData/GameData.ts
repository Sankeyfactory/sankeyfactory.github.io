// Ignore import error as the file only appears on launch of the exporting tool.
// @ts-ignore
import satisfactoryData from '../../dist/GameData/Satisfactory.json';

import { GameMachine } from './GameMachine';
import { GameRecipe } from './GameRecipe';

export function satisfactoryIconPath(path: string): string
{
    return `GameData/SatisfactoryIcons/${path}`;
}

export function toItemsInMinute(amount: number, consumingTime: number): number
{
    return (60 / consumingTime) * amount;
}

export function overclockPower(power: number, overclockRatio: number, powerExponent: number): number
{
    return power * Math.pow(overclockRatio, powerExponent);
}

export function overclockToShards(overclockRatio: number): number
{
    if (overclockRatio <= 1)
    {
        return 0;
    }

    return Math.ceil((overclockRatio - 1) / 0.5);
}

export function loadSatisfactoryResource(resourceId: string): Resource
{
    let resource = satisfactoryData.resources.find(
        (resourceData: typeof satisfactoryData.resources[0]) =>
        {
            return resourceData.id === resourceId;
        }
    );

    if (resource == undefined)
    {
        throw Error(`Couldn't find resource "${resourceId}"`);
    }

    return resource;
}

export function loadSatisfactoryRecipe(recipeId: string): { recipe: GameRecipe, machine: GameMachine; }
{
    for (const machine of satisfactoryData.machines)
    {
        let result = machine.recipes.find((recipe) => recipe.id === recipeId);

        if (result != undefined)
        {
            return { recipe: GameRecipe.fromRawData(result, machine), machine: machine };
        }

        let alternate = machine.alternateRecipes.find((recipe) => recipe.id === recipeId);

        if (alternate != undefined)
        {
            return { recipe: GameRecipe.fromRawData(alternate, machine), machine: machine };
        }
    }

    throw Error(`Couldn't find recipe "${recipeId}"`);
}

/** If there are multiple suitable recipes or none, returns `undefined` */
export function loadSingleSatisfactoryRecipe(requiredItem: { id: string; type: "input" | "output"; }):
    { recipe: GameRecipe; machine: GameMachine; resourceAmount: number; } | undefined
{
    let suitableRecipe: GameRecipe | undefined = undefined;
    let suitableMachine: GameMachine | undefined = undefined;
    let resourceAmount = 0;

    for (const machine of satisfactoryData.machines)
    {
        const findSingle = (recipe: typeof machine.recipes[0], resources: RecipeResource[]) =>
        {
            let foundResource = resources.find(
                resource => resource.id === requiredItem.id
            );

            if (foundResource != undefined)
            {
                if (suitableRecipe != undefined || suitableMachine != undefined)
                {
                    return false;
                }

                suitableRecipe = GameRecipe.fromRawData(recipe, machine);
                suitableMachine = machine;
                resourceAmount = foundResource.amount;
            }

            return true;
        };

        for (const recipe of machine.recipes)
        {
            if ((requiredItem.type === "input" && !findSingle(recipe, recipe.ingredients))
                || (requiredItem.type === "output" && !findSingle(recipe, recipe.products)))
            {
                return undefined;
            }
        }

        for (const recipe of machine.alternateRecipes)
        {
            if ((requiredItem.type === "input" && !findSingle(recipe, recipe.ingredients))
                || (requiredItem.type === "output" && !findSingle(recipe, recipe.products)))
            {
                return undefined;
            }
        }
    }

    if (suitableRecipe == undefined || suitableMachine == undefined)
    {
        return undefined;
    }
    else
    {
        return {
            recipe: suitableRecipe,
            machine: suitableMachine,
            resourceAmount: resourceAmount,
        };
    }
}
