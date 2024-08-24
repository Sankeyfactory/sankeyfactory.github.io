import { GameMachine } from "./GameMachine";

export class GameRecipe
{
    public constructor(
        public id: string,
        public displayName: string,
        public ingredients: RecipeResource[],
        public products: RecipeResource[],
        public manufacturingDuration: number
    ) { }
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
