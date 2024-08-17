type Docs = {
    NativeClass: string;
    Classes: (DocsClass | DocsRecipe | DocsBuilding)[];
}[];

type DocsClass = {
    ClassName: string;
};

// Holds general properties of items and machines.
type DocsDescriptor = {
    ClassName: string;

    mForm: string;

    mDisplayName: string;
    mDescription: string;

    mPersistentBigIcon: string;

    mResourceSinkPoints: string;
};

type DocsRecipe = {
    ClassName: string;

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
