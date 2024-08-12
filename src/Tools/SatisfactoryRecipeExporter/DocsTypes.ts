type Docs = {
    NativeClass: string;
    Classes: (DocsClass | DocsRecipe | DocsBuilding)[];
}[];

type DocsClass = {
    ClassName: string;
};

type DocsRecipe = {
    ClassName: string;

    FullName: string; // Used for an icon.
    mDisplayName: string;

    mIngredients: string;
    mProduct: string;

    mProducedIn: string;
    mManufactoringDuration: string;
};

type DocsBuilding = {
    ClassName: string;

    mDisplayName: string;
    mDescription: string;

    mPowerConsumption: string;
    mPowerConsumptionExponent: string;
};
