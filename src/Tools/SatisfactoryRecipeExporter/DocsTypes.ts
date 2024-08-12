type Docs = {
    NativeClass: string,
    Classes: (DocsClass | DocsRecipe | DocsBuilding)[];
}[];

type DocsClass = {
    ClassName: string;
};

type DocsRecipe = {
    ClassName: string,
    mProducedIn: string;
};

type DocsBuilding = {
    ClassName: string;
};
