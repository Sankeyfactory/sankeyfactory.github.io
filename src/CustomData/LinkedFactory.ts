import { AppData } from "../AppData";
import { Machine } from "../Machine";
import { Recipe } from "../Recipe";
import { CustomMachine } from "./CustomMachine";

// Container for data that represents a saved factory that has been loaded into a separate factory.
export class LinkedFactory implements Recipe
{
    private _machine: Machine;
    // LinkedFactories are always reported in items per minute
    public manufacturingDuration: number = 60;

    public constructor(
        public id: string,
        public displayName: string,
        public ingredients: RecipeResource[],
        public products: RecipeResource[],
        public customPower: number,
    ) {

        let machine = CustomMachine.getPlaceholderMachine("Temp",customPower);
        this._machine = machine;
    }

    public getRecipeType(): string {
        return "LinkedFactory";
    }

    public getMachine(): Machine
    {
        return this._machine;
    }

    public toSerializable(): AppData.SerializableCustomRecipe
    {
        return {
            "ingredients": this.ingredients,
            "products": this.products
        }
    }

    public static fromSerializable(id: string, serialized: AppData.SerializableCustomRecipe, customPower: number): LinkedFactory
    {
        let factory = new LinkedFactory(id, id, serialized.ingredients, serialized.products, customPower);
        return factory;
    }
}
