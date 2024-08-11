import fs from 'fs';

// The file is taken directly from the game at
// "Satisfactory/CommunityResources/Docs/Docs.json"
let docsPath = "src/Tools/SatisfactoryRecipeExporter/Docs.json";
let satisfactory = JSON.parse(fs.readFileSync(docsPath, "utf-8"));
let gameVersion = "0.8.3.3";

type MachineFrequencyMap = {
    [id: string]: number;
};
const machineFrequency: MachineFrequencyMap = {};

let totalRecipesAmount = 0;
let alternateAmount = 0;

let docsRecipes = satisfactory
    .map((classList: any) => classList.Classes)
    .flat()
    .filter((recipeClass: any) => recipeClass.ClassName.startsWith("Recipe_"))
    .map((docsRecipe: any) =>
    {
        let producedIn: string = docsRecipe.mProducedIn;

        // Removes surrounding parentheses.
        producedIn = producedIn.substring(1, producedIn.length - 1);

        let machines = producedIn.split(",").filter((name) =>
        {
            return name != "";
        }).map(((name) =>
        {
            let tokens = name.substring(1, name.length - 1).split(".");
            return tokens[tokens.length - 1];
        }));

        // Replace docs array-like string with an array of strings.
        docsRecipe.mProducedIn = machines;

        return docsRecipe;
    })
    .map((docsRecipe: any) =>
    {
        docsRecipe.mProducedIn = docsRecipe.mProducedIn.filter((machine: string) =>
        {
            // Machines that don't start with "Build_" are probably only for items that
            // can't be automated or are deprecated.
            return machine.startsWith("Build_");
        });

        return docsRecipe;
    })
    .filter((docsRecipe: any) =>
    {
        let machines: string[] = docsRecipe.mProducedIn;

        // If an item can only be crafted by these things then it can't be automated or is deprecated.
        let blacklistedMachines = [
            'Build_AutomatedWorkBench_C'
        ];

        let blacklistedAmount = 0;

        machines.forEach((machine) =>
        {
            if (blacklistedMachines.includes(machine))
            {
                ++blacklistedAmount;
            }
        });

        // If machines are missing or are all blacklisted, we filter the recipe out.
        return (machines.length > 0 && machines.length != blacklistedAmount);
    });

docsRecipes.forEach((docsRecipe: any) =>
{
    let machines: string[] = docsRecipe.mProducedIn;

    machines.forEach((machine) =>
    {
        if (machineFrequency[machine] == undefined)
        {
            machineFrequency[machine] = 0;
        }

        ++machineFrequency[machine];
    });

    ++totalRecipesAmount;

    if (docsRecipe.ClassName.startsWith("Recipe_Alternate_"))
    {
        ++alternateAmount;
    }
});

console.log(machineFrequency);
console.log(`Total: ${totalRecipesAmount}`);
console.log(`Alternate: ${alternateAmount}`);

