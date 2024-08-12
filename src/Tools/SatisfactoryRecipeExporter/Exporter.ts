import fs from 'fs';

// The file is taken directly from the game at
// "Satisfactory/CommunityResources/Docs/Docs.json"
let docsPath = "src/Tools/SatisfactoryRecipeExporter/Docs.json";
let satisfactory = JSON.parse(fs.readFileSync(docsPath, "utf-8")) as Docs;
let gameVersion = "0.8.3.3";

const machineFrequency: Map<string, number> = new Map();

let totalRecipesAmount = 0;
let alternateAmount = 0;

function parseMachines(docsMachines: string): string[]
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

let recipes: Recipe[] = satisfactory
    .flatMap((classList) => classList.Classes)
    .filter((recipeClass) => recipeClass.ClassName.startsWith("Recipe_"))
    .map(docsRecipe => docsRecipe as DocsRecipe)
    .map<Recipe>((docsRecipe) =>
    {
        let blacklistedMachines = [
            'Build_AutomatedWorkBench_C'
        ];

        let machines = parseMachines(docsRecipe.mProducedIn)
            .filter((name) =>
            {
                // Machines that don't start with "Build_" are probably only for items that
                // can't be automated or are deprecated.
                return name.startsWith("Build_") && !blacklistedMachines.includes(name);
            });

        return {
            id: docsRecipe.ClassName,
            isAlternate: docsRecipe.ClassName.startsWith("Recipe_Alternate_"),
            producedIn: machines,
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
            powerConsumptionExponent: +docsBuilding.mPowerConsumptionExponent
        };
    });

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

fs.writeFileSync(
    "dist/GameData/Satisfactory.json",
    JSON.stringify({
        gameVersion: gameVersion,
        recipes: recipes,
        machines: machines
    }, undefined, 4)
);
