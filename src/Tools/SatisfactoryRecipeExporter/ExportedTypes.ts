type Resource = {
    id: string;
    amount: number;
};

type Recipe = {
    id: string;

    displayName: string;
    isAlternate: boolean;

    ingredients: Resource[];
    products: Resource[];

    producedIn: string[];
    manufacturingDuration: number;
};

type BuildingRecipe = Omit<Recipe, "producedIn" | "isAlternate">;

type Building = {
    id: string;

    displayName: string;
    description: string;

    powerConsumption: number;
    powerConsumptionExponent: number;

    recipes: BuildingRecipe[];
    alternateRecipes: BuildingRecipe[];
};

// Holds general properties of items and machines.
type Descriptor = {
    id: string;

    displayName: string;
    description: string;

    iconPath: string;
};
