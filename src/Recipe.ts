import { AppData } from "./AppData";
import { Machine } from "./Machine";

export interface Recipe
{
    id: string,
    displayName: string,
    ingredients: RecipeResource[],
    products: RecipeResource[],
    manufacturingDuration: number,
    getRecipeType: () => string,
    toSerializable: () => AppData.SerializableCustomRecipe,
    getMachine: () => Machine
}
