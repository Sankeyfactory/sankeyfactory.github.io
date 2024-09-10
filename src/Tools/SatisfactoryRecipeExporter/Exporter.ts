import fs from 'fs';

// The file is taken directly from the game at
// "Satisfactory/CommunityResources/Docs/Docs.json"
let docsPath = "src/Tools/SatisfactoryRecipeExporter/Docs.json";
let satisfactory = JSON.parse(fs.readFileSync(docsPath, "utf-8")) as Docs;
let gameVersion = "1.0";

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

function parseResourcesList(docsResources: string): RecipeResource[]
{
    let result: RecipeResource[] = [];

    let resourcesRegex = /\(ItemClass=".+?'\\?.+?\.(.+?)\\?'",Amount=(\d+)\)/g;

    let match: RegExpExecArray;
    while (match = resourcesRegex.exec(docsResources)!)
    {
        result.push({
            id: match[1],
            amount: +match[2]
        });
    }

    if (result.length === 0)
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
            return recipe.producedIn.includes(machineName) && recipe.isAlternate === alternate;
        })
        .toSorted((first, second) =>
        {
            return first.complexity - second.complexity;
        })
        .map(recipe =>
        {
            let { isAlternate, producedIn, complexity, ...buildingRecipe } = recipe;
            return buildingRecipe;
        });
}

function getMachineDescriptorId(machineId: string): string
{
    let idRegex = /Build_(.+?)_C/;
    let match = idRegex.exec(machineId);

    if (match == null)
    {
        throw Error(`Couldn't parse machine id: ${machineId}`);
    }

    let machineName = match[1];

    return `Desc_${machineName}_C`;
}

function parseNativeClass(docsNativeClass: string): string
{

    let idRegex = /.+\.([a-zA-Z]+)'/;
    let match = idRegex.exec(docsNativeClass);

    if (match == null)
    {
        throw Error(`Couldn't parse native class: ${docsNativeClass}`);
    }

    let nativeClass = match[1];

    return nativeClass;
}

let mapClassList = (classList: typeof satisfactory[0]) =>
{
    let classes = classList.Classes;

    for (const docsClass of classes)
    {
        docsClass.NativeClass = parseNativeClass(classList.NativeClass);
    }

    return classes;
};

let fixCubicMeters = (resource: RecipeResource, descriptor: Descriptor | undefined) =>
{
    if (descriptor?.form == "LIQUID" || descriptor?.form == "GAS")
    {
        // Because liquids and gas are in cubic meters
        resource.amount /= 1000;
    }
};

let formFrequency = new Map<string, number>();

let descriptorsMap = new Map<string, Descriptor>(satisfactory
    .flatMap(mapClassList)
    .filter((descriptorClass) =>
    {
        return descriptorClass.ClassName.startsWith("Desc_")
            || descriptorClass.ClassName === "BP_ItemDescriptorPortableMiner_C"
            || descriptorClass.ClassName === "BP_EquipmentDescriptorBeacon_C";
    })
    .map(docsDescriptor => docsDescriptor as DocsDescriptor)
    .map<Descriptor>((docsDescriptor) =>
    {
        let iconPath = "";
        let iconName = "";

        if (docsDescriptor.mPersistentBigIcon === "Texture2D /Game/FactoryGame/IconDesc_PortableMiner_256.IconDesc_PortableMiner_256")
        {
            iconPath = "Equipment/PortableMiner/";
            iconName = "PortableMiner";
        }
        else if (docsDescriptor.mPersistentBigIcon !== "None")
        {
            let iconRegex = /Texture2D \/Game\/FactoryGame\/(?<path>[\w-/]+?\/)(?:IconDesc_)?(?<name>\w+?)(?:_\d+)?\./;

            let match = iconRegex.exec(docsDescriptor.mPersistentBigIcon);

            if (match == null)
            {
                throw Error(`Couldn't parse icon path: ${docsDescriptor.mPersistentBigIcon}.`
                    + `Id: ${docsDescriptor.ClassName}`);
            }

            iconPath = match.groups!.path.replace("UI/", "");
            iconName = match.groups!.name;
        }

        formFrequency.set(docsDescriptor.mForm, (formFrequency.get(docsDescriptor.mForm) ?? 0) + 1);

        let form = docsDescriptor.mForm.replace("RF_", "") as ResourceForm;

        // mDisplayName is empty here for buildings and should be filled by
        // building class later.
        return {
            id: docsDescriptor.ClassName,
            nativeClass: docsDescriptor.NativeClass,
            displayName: docsDescriptor.mDisplayName,
            iconPath: `${iconPath}${iconName}.png`,
            isResourceInUse: false, // Will be set after parsing recipes.
            resourceSinkPoints: +docsDescriptor.mResourceSinkPoints,
            form: form,
            energyValue: +docsDescriptor.mEnergyValue,
        };
    })
    .map(descriptor => [descriptor.id, descriptor]));

let recipes: Recipe[] = satisfactory
    .flatMap(mapClassList)
    .filter((recipeClass) => recipeClass.ClassName.startsWith("Recipe_"))
    .map(docsRecipe => docsRecipe as DocsRecipe)
    .filter(docsRecipe =>
    {
        return docsRecipe.mIngredients !== "" && docsRecipe.mProduct !== "";
    })
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

        let ingredients = parseResourcesList(docsRecipe.mIngredients);
        let products = parseResourcesList(docsRecipe.mProduct);

        let ingredientsComplexity = 0;
        let productsComplexity = 0;

        for (const ingredient of ingredients)
        {
            let resource = descriptorsMap.get(ingredient.id);

            ingredientsComplexity = Math.max(ingredientsComplexity, resource?.resourceSinkPoints ?? 0);

            fixCubicMeters(ingredient, resource);
        }

        for (const product of products)
        {
            let resource = descriptorsMap.get(product.id);

            productsComplexity = Math.max(productsComplexity, resource?.resourceSinkPoints ?? 0);

            fixCubicMeters(product, resource);
        }

        // Products which can't be sinked are usually very late-game ones or just should be together.
        productsComplexity = productsComplexity == 0 ? 99999 : productsComplexity;

        return {
            id: docsRecipe.ClassName,
            displayName: docsRecipe.mDisplayName,
            isAlternate: docsRecipe.mDisplayName.startsWith("Alternate:"),
            complexity: Math.max(ingredientsComplexity, productsComplexity),
            ingredients: ingredients,
            products: products,
            producedIn: machines,
            manufacturingDuration: +docsRecipe.mManufactoringDuration
        };
    })
    .filter((docsRecipe) => docsRecipe.producedIn.length > 0);

let machines: Building[] = satisfactory
    .flatMap(mapClassList)
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
        let descriptorId = getMachineDescriptorId(docsBuilding.ClassName);

        let descriptor = descriptorsMap.get(descriptorId);

        if (descriptor == undefined)
        {
            throw Error(`Couldn't find machine descriptor: ${descriptorId}`);
        }

        return {
            id: docsBuilding.ClassName,
            displayName: docsBuilding.mDisplayName,
            iconPath: descriptor.iconPath,
            powerConsumption: +docsBuilding.mPowerConsumption,
            powerConsumptionExponent: +docsBuilding.mPowerConsumptionExponent,
            recipes: getMachinesRecipe(docsBuilding.ClassName, recipes, false),
            alternateRecipes: getMachinesRecipe(docsBuilding.ClassName, recipes, true),
        };
    });

let powerGenerators: Building[] = satisfactory
    .flatMap(mapClassList)
    .filter(recipeClass =>
    {
        return recipeClass.ClassName.startsWith("Build_Generator")
            && recipeClass.ClassName !== "Build_GeneratorGeoThermal_C";
    })
    .map(docsRecipe => docsRecipe as DocsPowerGenerator)
    .map(docsPowerGenerator =>
    {
        let descriptorId = getMachineDescriptorId(docsPowerGenerator.ClassName);

        let descriptor = descriptorsMap.get(descriptorId);

        if (descriptor == undefined)
        {
            throw Error(`Couldn't find machine descriptor: ${descriptorId}`);
        }

        let recipes: BuildingRecipe[] = [];

        for (const fuel of docsPowerGenerator.mFuel)
        {
            let fuelTypes = [...descriptorsMap.values()].filter(descriptor =>
            {
                let isSuitable = descriptor.id === fuel.mFuelClass || descriptor.nativeClass === fuel.mFuelClass;

                if (isSuitable)
                {
                    descriptor.isResourceInUse = true;
                }

                return isSuitable;
            });

            let producedPower = +docsPowerGenerator.mPowerProduction;

            let supplementId = fuel.mSupplementalResourceClass;
            let supplement: Descriptor | undefined;

            if (supplementId !== "")
            {
                supplement = descriptorsMap.get(supplementId);

                if (supplement == undefined)
                {
                    throw Error(`Couldn't find supplement descriptor: ${supplementId}`);
                }

                supplement.isResourceInUse = true;
            }

            let supplementAmountInSecond = producedPower * +docsPowerGenerator.mSupplementalToPowerRatio;

            let byproduct: RecipeResource | undefined;

            if (fuel.mByproduct != "")
            {
                let byproductDescriptor = descriptorsMap.get(fuel.mByproduct);

                if (byproductDescriptor == undefined)
                {
                    throw Error(`Couldn't find byproduct descriptor: ${fuel.mByproduct}`);
                }

                byproductDescriptor.isResourceInUse = true;

                byproduct = {
                    id: byproductDescriptor.id,
                    amount: +fuel.mByproductAmount,
                };

                fixCubicMeters(byproduct, byproductDescriptor);
            }

            for (const fuelType of fuelTypes)
            {
                if (fuelType.energyValue === 0) continue;

                let productionDuration = fuelType.energyValue / producedPower;

                if (fuelType.form === "LIQUID" || fuelType.form === "GAS")
                {
                    productionDuration *= 1000;
                }

                let fuelIngredient: RecipeResource = {
                    id: fuelType.id,
                    amount: 1,
                };

                let recipe: BuildingRecipe = {
                    id: `Power_${docsPowerGenerator.ClassName}_${fuelType.id}`,
                    displayName: `${fuelType.displayName} (burning)`,
                    ingredients: [fuelIngredient],
                    products: [],
                    producedPower: producedPower,
                    manufacturingDuration: productionDuration,
                };

                if (supplement != undefined)
                {
                    let supplementalIngredient: RecipeResource = {
                        id: supplement.id,
                        amount: supplementAmountInSecond * productionDuration,
                    };

                    fixCubicMeters(supplementalIngredient, supplement);

                    recipe.ingredients.push(supplementalIngredient);
                }

                if (byproduct != undefined)
                {
                    recipe.products.push(byproduct);
                }

                recipes.push(recipe);
            }
        }

        return {
            id: docsPowerGenerator.ClassName,
            displayName: docsPowerGenerator.mDisplayName,
            iconPath: descriptor.iconPath,
            powerConsumption: +docsPowerGenerator.mPowerConsumption,
            powerConsumptionExponent: +docsPowerGenerator.mPowerConsumptionExponent,
            recipes: recipes,
            alternateRecipes: [],
        };
    });

machines.push(...powerGenerators);

for (const recipe of recipes)
{
    let markResourceAsUsed = (resource: RecipeResource): void =>
    {
        let descriptor = descriptorsMap.get(resource.id);

        if (descriptor == undefined)
        {
            throw Error(`Couldn't find resource descriptor: ${resource.id}`);
        }

        descriptor.isResourceInUse = true;
    };

    recipe.ingredients.forEach(markResourceAsUsed);
    recipe.products.forEach(markResourceAsUsed);
}

const machineFrequency: Map<string, number> = new Map();

let totalRecipesAmount = 0;
let alternateAmount = 0;

for (const recipe of recipes)
{
    let machines: string[] = recipe.producedIn;

    for (const machine of machines)
    {
        machineFrequency.set(machine, (machineFrequency.get(machine) ?? 0) + 1);
    }

    ++totalRecipesAmount;

    if (recipe.id.startsWith("Recipe_Alternate_"))
    {
        ++alternateAmount;
    }
}

console.log(machineFrequency);
console.log(`Total: ${totalRecipesAmount}`);
console.log(`Alternate: ${alternateAmount}`);
console.log(`Machines: ${machines.length}`);
console.log(`Descriptors: ${descriptorsMap.size}`);
console.log(formFrequency);

let machinesSorter = (first: Building, second: Building): number =>
{
    const order = [
        "Smelter", "Constructor", "Assembler", "Foundry", "Refinery", "Manufacturer",
        "Packager", "Blender", "Particle Accelerator"
    ];

    const firstOrder = order.indexOf(first.displayName);
    const secondOrder = order.indexOf(second.displayName);

    if (firstOrder === -1 && secondOrder === -1)
    {
        // Both names are not in the order array, keep their relative positions.
        return 0;
    }
    if (firstOrder === -1)
    {
        // First's name is not in the order array, place it after the second.
        return 1;
    }
    if (secondOrder === -1)
    {
        // Second's name is not in the order array, place it after the first.
        return -1;
    }

    // Sort by the order array.
    return firstOrder - secondOrder;
};

descriptorsMap.set("Power", {
    id: "Power",
    displayName: "Power",
    iconPath: "Resource/Power.png",

    isResourceInUse: true,

    energyValue: 0,
    form: 'INVALID',
    resourceSinkPoints: 0,
});

let destinationDir = "dist/GameData";
fs.mkdirSync(destinationDir, { recursive: true });
fs.writeFileSync(
    `${destinationDir}/Satisfactory.json`,
    JSON.stringify({
        gameVersion: gameVersion,
        machines: machines.toSorted(machinesSorter),
        resources: [...descriptorsMap.values()]
            .filter(descriptor => descriptor.isResourceInUse)
            .map<Resource>(descriptor =>
            {
                let { nativeClass, isResourceInUse, resourceSinkPoints, form, energyValue, ...resource } = descriptor;
                return resource;
            })
    })
);
