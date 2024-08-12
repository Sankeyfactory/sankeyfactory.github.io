import fs from 'fs';

// The file is taken directly from the game at
// "Satisfactory/CommunityResources/Docs/Docs.json"
let docsPath = "src/Tools/SatisfactoryRecipeExporter/Docs.json";
let satisfactory = JSON.parse(fs.readFileSync(docsPath, "utf-8")) as Docs;
let gameVersion = "0.8.3.3";

const machineFrequency: Map<string, number> = new Map();

let totalRecipesAmount = 0;
let alternateAmount = 0;

let recipes = new Map<string, Recipe>(satisfactory
    .flatMap((classList) => classList.Classes)
    .filter((recipeClass) => recipeClass.ClassName.startsWith("Recipe_"))
    .map(docsRecipe => docsRecipe as DocsRecipe)
    .map<Recipe>((docsRecipe) =>
    {
        let producedIn: string = docsRecipe.mProducedIn;

        // Removes surrounding parentheses.
        producedIn = producedIn.substring(1, producedIn.length - 1);

        let blacklistedMachines = [
            'Build_AutomatedWorkBench_C'
        ];

        let machines = producedIn
            .split(",")
            .filter((name) => name !== "")
            .map(((name) =>
            {
                // View in docs: "/Game/FactoryGame/Buildable/Factory/ConstructorMk1/Build_ConstructorMk1.Build_ConstructorMk1_C"
                // Desired view: Build_ConstructorMk1_C
                let a = name.slice(1, -1).split(`.`);
                return a[a.length - 1];
            }))
            .filter((name) =>
            {
                // Machines that don't start with "Build_" are probably only for items that
                // can't be automated or are deprecated.
                return name.startsWith("Build_") && !blacklistedMachines.includes(name);
            });

        return {
            id: docsRecipe.ClassName,
            producedIn: machines,
        };
    })
    .filter((docsRecipe) => docsRecipe.producedIn.length > 0)
    .map((docsRecipe) => [docsRecipe.id, docsRecipe]));

let docsMachines = new Map<string, Building>(satisfactory
    .flatMap(classList => classList.Classes)
    .filter(recipeClass => recipeClass.ClassName.startsWith("Build_"))
    .filter(docsBuilding =>
    {
        return [...recipes.values()].some((recipe) => recipe.producedIn.includes(docsBuilding.ClassName));
    })
    .map<Building>(building =>
    {
        return {
            id: building.ClassName
        };
    })
    .map(docsRecipe => [docsRecipe.id, docsRecipe]));

for (const [id, recipe] of recipes)
{
    let machines: string[] = recipe.producedIn;

    machines.forEach((machine) =>
    {
        machineFrequency.set(machine, (machineFrequency.get(machine) ?? 0) + 1);
    });

    ++totalRecipesAmount;

    if (id.startsWith("Recipe_Alternate_"))
    {
        ++alternateAmount;
    }
}

console.log(machineFrequency);
console.log(`Total: ${totalRecipesAmount}`);
console.log(`Alternate: ${alternateAmount}`);
console.log(`Machines: ${docsMachines.size}`);

