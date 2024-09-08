import { GameMachine } from "./GameMachine";
import { AppData } from "../AppData";
import { Recipe } from "../Recipe";
import { Machine } from "../Machine";
import { loadSatisfactoryRecipe } from "./GameData";
// Represents a receipe that exists in the game.
export class GameRecipe implements Recipe
{
    public constructor(
        public id: string,
        public displayName: string,
        public ingredients: RecipeResource[],
        public products: RecipeResource[],
        public manufacturingDuration: number,
        private _machine: GameMachine,
    ) {}

    public getRecipeType(): string {
        return "GameRecipe";
    }

    // We don't actually serialize standard recipes, they get loaded from game data
    public toSerializable(): AppData.SerializableCustomRecipe {
        return {
            "ingredients": [],
            "products": []
        }
    }

    public static fromSerializable(id: string): GameRecipe
    {
        return loadSatisfactoryRecipe(id).recipe;
    }

    public static fromRawData(object: {id: string, displayName: string, ingredients: RecipeResource[], products: RecipeResource[], manufacturingDuration: number}, machine: GameMachine): GameRecipe
    {
        let recipe =  new GameRecipe(
            object.id,
            object.displayName,
            object.ingredients,
            object.products,
            object.manufacturingDuration,
            machine
        );
        return recipe;
    }

    public getMachine(): Machine
    {
        return this._machine;
    }
}

export class GameRecipeEvent extends Event
{
    public recipe?: GameRecipe;
    public machine?: GameMachine;

    public constructor(
        recipe: GameRecipe | undefined,
        machine: GameMachine | undefined,
        type: string,
        eventInitDict?: EventInit
    )
    {
        super(type, eventInitDict);
        this.recipe = recipe;
        this.machine = machine;
    }
}
