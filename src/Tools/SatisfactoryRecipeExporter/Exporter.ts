import fs from 'fs';

// The file is taken directly from the game at
// "Satisfactory/CommunityResources/Docs/Docs.json"
let docsPath = "src/Tools/SatisfactoryRecipeExporter/Docs.json";
let satisfactory = JSON.parse(fs.readFileSync(docsPath, "utf-8")) as Docs;
let gameVersion = "0.8.3.3";

function parseMachinesList(docsMachines: string): string[]
{
    return docsMachines
        .substring(1, docsMachines.length - 1) // Removes surrounding parentheses
        .split(",")
        .filter((name) => name !== "")
        .map(((name) =>
        {
            // View in docs: "/Game/FactoryGame/.../Build_ConstructorMk1.Build_ConstructorMk1_C"
            // Desired view: Build_ConstructorMk1_C
            return name.slice(1, -1).split(`.`).at(-1)!;
        }));
}

function parseResourcesList(docsResources: string): Resource[]
{
    let result: Resource[] = [];

    let resourcesRegex = /\(ItemClass=.+?'\\?".+?\.(.+?)\\?"',Amount=(\d+)\)/g;

    let match: RegExpExecArray;
    while (match = resourcesRegex.exec(docsResources)!)
    {
        result.push({
            id: match[1],
            amount: +match[2]
        });
    }

    if (result.length == 0)
    {
        throw Error(`Couldn't parse resources list: ${docsResources}`);
    }

    return result;
}

function getMachinesRecipe(machineName: string, allRecipes: Recipe[], alternate: boolean): BuildingRecipe[]
{
    return allRecipes
        .filter(recipe =>
        {
            return recipe.producedIn.includes(machineName) && recipe.isAlternate == alternate;
        })
        .map(recipe =>
        {
            let { isAlternate, producedIn, ...buildingRecipe } = recipe;
            return buildingRecipe;
        });
}

let formFrequency = new Map<string, number>();

let descriptorsMap = new Map<string, Descriptor>(satisfactory
    .flatMap((classList) => classList.Classes)
    .filter((descriptorClass) => descriptorClass.ClassName.startsWith("Desc_"))
    .map(docsDescriptor => docsDescriptor as DocsDescriptor)
    .map<Descriptor>((docsDescriptor) =>
    {
        let iconPath = "";
        let iconAdditionalPath = "";
        let iconName = "";

        if (docsDescriptor.mPersistentBigIcon !== "None")
        {
            let iconRegex = /Texture2D \/Game\/FactoryGame\/([\w-/]+?\/)(?:IconDesc_)?(\w+?)(?:_\d+)?\./;

            let match = iconRegex.exec(docsDescriptor.mPersistentBigIcon);

            if (match == null)
            {
                throw Error(`Couldn't parse icon path: ${docsDescriptor.mPersistentBigIcon}`);
            }

            iconPath = match[1].replaceAll("UI/", "");
            iconName = match[2];
        }

        formFrequency.set(docsDescriptor.mForm, (formFrequency.get(docsDescriptor.mForm) ?? 0) + 1);

        // mDisplayName and mDescription are empty here for buildings and should be filled by
        // building class later.
        return {
            id: docsDescriptor.ClassName,
            displayName: docsDescriptor.mDisplayName,
            description: docsDescriptor.mDescription,
            iconPath: `${iconPath}${iconAdditionalPath}${iconName}.png`
        };
    })
    .map(descriptor => [descriptor.id, descriptor]));

let recipes: Recipe[] = satisfactory
    .flatMap((classList) => classList.Classes)
    .filter((recipeClass) => recipeClass.ClassName.startsWith("Recipe_"))
    .map(docsRecipe => docsRecipe as DocsRecipe)
    .filter(docsRecipe => docsRecipe.mIngredients !== "")
    .filter(docsRecipe => docsRecipe.mProduct !== "")
    .map<Recipe>((docsRecipe) =>
    {
        let blacklistedMachines = [
            'Build_AutomatedWorkBench_C'
        ];

        let machines = parseMachinesList(docsRecipe.mProducedIn)
            .filter((name) =>
            {
                // Machines that don't start with "Build_" are probably only for items that
                // can't be automated or are deprecated.
                return name.startsWith("Build_") && !blacklistedMachines.includes(name);
            });

        return {
            id: docsRecipe.ClassName,
            displayName: docsRecipe.mDisplayName,
            isAlternate: docsRecipe.ClassName.startsWith("Recipe_Alternate_"),
            ingredients: parseResourcesList(docsRecipe.mIngredients),
            products: parseResourcesList(docsRecipe.mProduct),
            producedIn: machines,
            manufacturingDuration: +docsRecipe.mManufactoringDuration
        };
    })
    .filter((docsRecipe) => docsRecipe.producedIn.length > 0);

let machines: Building[] = satisfactory
    .flatMap(classList => classList.Classes)
    .filter(recipeClass => recipeClass.ClassName.startsWith("Build_"))
    .map(docsRecipe => docsRecipe as DocsBuilding)
    .filter(docsBuilding =>
    {
        return recipes.some((recipe) =>
        {
            return recipe.producedIn.includes(docsBuilding.ClassName);
        });
    })
    .map<Building>(docsBuilding =>
    {
        return {
            id: docsBuilding.ClassName,
            displayName: docsBuilding.mDisplayName,
            description: docsBuilding.mDescription.replaceAll("\r\n", "\n"),
            powerConsumption: +docsBuilding.mPowerConsumption,
            powerConsumptionExponent: +docsBuilding.mPowerConsumptionExponent,
            recipes: getMachinesRecipe(docsBuilding.ClassName, recipes, false),
            alternateRecipes: getMachinesRecipe(docsBuilding.ClassName, recipes, true),
        };
    });

const machineFrequency: Map<string, number> = new Map();

let totalRecipesAmount = 0;
let alternateAmount = 0;

recipes.forEach(recipe =>
{
    let machines: string[] = recipe.producedIn;

    machines.forEach((machine) =>
    {
        machineFrequency.set(machine, (machineFrequency.get(machine) ?? 0) + 1);
    });

    ++totalRecipesAmount;

    if (recipe.id.startsWith("Recipe_Alternate_"))
    {
        ++alternateAmount;
    }
});

console.log(machineFrequency);
console.log(`Total: ${totalRecipesAmount}`);
console.log(`Alternate: ${alternateAmount}`);
console.log(`Machines: ${machines.length}`);
console.log(`Descriptors: ${descriptorsMap.size}`);
console.log(formFrequency);

fs.writeFileSync(
    "dist/GameData/Satisfactory.json",
    JSON.stringify({
        gameVersion: gameVersion,
        machines: machines,
        resources: [...descriptorsMap.values()]
    }, undefined, 4)
);
