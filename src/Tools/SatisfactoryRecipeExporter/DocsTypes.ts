type Docs = {
    NativeClass: string;
    Classes: (DocsClass | DocsRecipe | DocsBuilding)[];
}[];

type DocsClass = {
    NativeClass?: string;
    ClassName: string;
};

// Holds general properties of items and machines.
type DocsDescriptor = DocsClass & {
    mForm: string;

    mDisplayName: string;
    mDescription: string;

    mPersistentBigIcon: string;

    mResourceSinkPoints: string;

    mEnergyValue: string;
};

type DocsRecipe = DocsClass & {
    mDisplayName: string;

    mIngredients: string;
    mProduct: string;

    mProducedIn: string;
    mManufactoringDuration: string;
};

type DocsBuilding = DocsClass & {
    mDisplayName: string;
    mDescription: string;

    mPowerConsumption: string;
    mPowerConsumptionExponent: string;
};

type DocsPowerGenerator = DocsBuilding & {
    mFuel: DocsFuel[];
    mSupplementalToPowerRatio: string;
    mPowerProduction: string;
};

type DocsFuel = {
    mFuelClass: string;

    mSupplementalResourceClass: string;

    mByproduct: string;
    mByproductAmount: string;
};
