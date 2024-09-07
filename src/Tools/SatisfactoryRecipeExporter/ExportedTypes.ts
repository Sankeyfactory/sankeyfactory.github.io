type RecipeResource = {
    id: string;
    amount: number;
};

type Recipe = {
    id: string;

    displayName: string;
    isAlternate: boolean;

    // For sorting from early-game to late-game resources.
    complexity: number;

    ingredients: RecipeResource[];
    products: RecipeResource[];

    producedIn: string[];
    manufacturingDuration: number;
};

type BuildingRecipe = Omit<Recipe, "producedIn" | "isAlternate" | "complexity">;

type Building = {
    id: string;

    iconPath: string;
    displayName: string;

    powerConsumption: number;
    powerConsumptionExponent: number;

    recipes: BuildingRecipe[];
    alternateRecipes: BuildingRecipe[];
};

// Holds general properties of items and machines.
type Descriptor = {
    id: string;

    displayName: string;

    iconPath: string;

    // Set if the resource is used in parsed recipes.
    isResourceInUse: boolean;

    // For resolving recipe complexity.
    resourceSinkPoints: number;

    form: ResourceForm;
};

type Resource = Omit<Descriptor, "isResourceInUse" | "resourceSinkPoints" | "form">;

type ResourceForm = "INVALID" | "SOLID" | "LIQUID" | "GAS";
