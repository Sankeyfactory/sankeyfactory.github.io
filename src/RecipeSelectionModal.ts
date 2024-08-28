// Ignore import error as the file only appears on launch of the exporting tool.
// @ts-ignore
import satisfactoryData from '../dist/GameData/Satisfactory.json';

import { loadSatisfactoryResource, satisfactoryIconPath, toItemsInMinute } from './GameData/GameData';
import { GameMachine } from './GameData/GameMachine';
import { GameRecipe } from './GameData/GameRecipe';

export class RecipeSelectionModal extends EventTarget
{
    public static readonly recipeConfirmedEvent = "recipe-confirmed";
    public static readonly recipeSelectedEvent = "recipe-selected";
    public static readonly recipesTabSwitchedEvent = "recipes-tab-switched";

    constructor()
    {
        super();

        this._gameVersionText.innerText = `game version: ${satisfactoryData.gameVersion}`;

        this._closeButton.addEventListener("click", this.closeModal.bind(this));

        this.setupTabs();

        this._confirmRecipeButton.addEventListener("click", this.confirmRecipe.bind(this));
        this._recipeTabs.addEventListener("click", this.discardSelectedRecipe.bind(this));
        this._discardRecipeButton.addEventListener("click", this.discardSelectedRecipe.bind(this));

        this.addEventListener(RecipeSelectionModal.recipeSelectedEvent, () =>
        {
            if (this._selectedRecipe == undefined)
            {
                this._selectedRecipeDisplay.classList.add("hidden");
            }
            else
            {
                this.updateResourceDisplay();
            }
        });

        this._tabSelectors.children[0].classList.add("active");
        this._recipeTabs.children[0].classList.add("active");

        this._modalContainer.querySelector(".modal-window")!.addEventListener("click", (event) =>
        {
            event.stopPropagation();
        });

        this._modalContainer.addEventListener("click", (event) =>
        {
            event.stopPropagation();
            this.closeModal();
        });

        window.addEventListener("keydown", (event) =>
        {
            if (event.code === "Escape" && this._isOpened)
            {
                event.preventDefault();
                event.stopPropagation();

                this.closeModal();
            }

            if (event.key === "Enter" && this._isOpened && this.selectedRecipe != undefined)
            {
                event.preventDefault();
                event.stopPropagation();

                this.confirmRecipe();
            }
        });
    }

    public openModal(): void
    {
        this._modalContainer.classList.remove("hidden");

        this._isOpened = true;
    }

    public get selectedRecipe()
    {
        return this._selectedRecipe;
    }

    private setupTabs(): void
    {
        for (const machine of satisfactoryData.machines)
        {
            let tabSelector = this.createHtmlElement<HTMLDivElement>("div", "tab-selector");

            tabSelector.title = machine.displayName;

            let machineIcon = this.createHtmlElement<HTMLImageElement>("img", "machine-icon");

            machineIcon.src = satisfactoryIconPath(machine.iconPath);
            machineIcon.alt = machine.displayName;
            machineIcon.loading = "lazy";

            let recipesTab = this.createHtmlElement<HTMLDivElement>("div", "recipes-tab");

            let basicRecipesGroup = this.createRecipesGroup("Basic recipes");
            let alternateRecipesGroup = this.createRecipesGroup("Alternate recipes");
            let eventsRecipesGroup = this.createRecipesGroup("Events recipes");

            machine.recipes.forEach((recipe: BuildingRecipe) => this.appendRecipes(
                basicRecipesGroup.div,
                eventsRecipesGroup.div,
                recipe,
                machine
            ));

            machine.alternateRecipes.forEach((recipe: BuildingRecipe) => this.appendRecipes(
                alternateRecipesGroup.div,
                eventsRecipesGroup.div,
                recipe,
                machine
            ));

            let appendIfNotEmpty = (group: typeof basicRecipesGroup) =>
            {
                if (group.div.childElementCount !== 0)
                {
                    recipesTab.append(group.title);
                    recipesTab.appendChild(group.div);
                }
            };

            appendIfNotEmpty(basicRecipesGroup);
            appendIfNotEmpty(alternateRecipesGroup);
            appendIfNotEmpty(eventsRecipesGroup);

            tabSelector.addEventListener("click", () =>
            {
                this.dispatchEvent(new Event(RecipeSelectionModal.recipesTabSwitchedEvent));

                recipesTab.classList.add("active");
                tabSelector.classList.add("active");
            });

            this.addEventListener(RecipeSelectionModal.recipesTabSwitchedEvent, () =>
            {
                recipesTab.classList.remove("active");
                tabSelector.classList.remove("active");

                this.discardSelectedRecipe();
            });

            tabSelector.appendChild(machineIcon);
            this._tabSelectors.appendChild(tabSelector);

            this._recipeTabs.appendChild(recipesTab);
        }
    }

    private createRecipesGroup(name: string): { div: HTMLDivElement, title: HTMLHeadingElement; }
    {
        let groupTitle = this.createHtmlElement<HTMLHeadingElement>("h3", "group-title");
        groupTitle.innerText = name;

        let groupDiv = this.createHtmlElement<HTMLDivElement>("div", "group");

        return { div: groupDiv, title: groupTitle };
    };

    private appendRecipes(
        recipesGroup: HTMLDivElement,
        eventsRecipesGroup: HTMLDivElement,
        recipe: BuildingRecipe,
        machine: Building): void 
    {
        let recipeSelector = document.createElement("div");
        recipeSelector.classList.add("recipe");
        recipeSelector.title = recipe.displayName;

        let isEventRecipe = false;

        for (const product of recipe.products)
        {
            let itemIcon = document.createElement("img");
            itemIcon.classList.add("item-icon");

            let resource = loadSatisfactoryResource(product.id);

            itemIcon.src = satisfactoryIconPath(resource.iconPath);
            if (!isEventRecipe)
            {
                isEventRecipe = resource.iconPath.startsWith("Events");
            }

            itemIcon.alt = recipe.displayName;
            itemIcon.loading = "lazy";

            recipeSelector.appendChild(itemIcon);
        }

        recipeSelector.addEventListener("click", (event) =>
        {
            event.stopPropagation();

            if (this._selectedRecipe?.recipe === recipe)
            {
                this.discardSelectedRecipe();
            }
            else
            {
                this.selectRecipe(recipe, machine, recipeSelector);
            }
        });

        recipeSelector.addEventListener("dblclick", (event) =>
        {
            event.stopPropagation();

            this.selectRecipe(recipe, machine, recipeSelector);
            this.confirmRecipe();
        });

        this.addEventListener(RecipeSelectionModal.recipeSelectedEvent, () =>
        {
            recipeSelector.classList.remove("selected");
        });

        if (isEventRecipe)
        {
            eventsRecipesGroup.appendChild(recipeSelector);
        }
        else
        {
            recipesGroup.appendChild(recipeSelector);
        }
    }

    private createResourceDisplay(
        parentDiv: HTMLDivElement,
        craftingTime: number,
        recipeResource: RecipeResource
    )
    {
        let descriptor = loadSatisfactoryResource(recipeResource.id);

        let resourceDiv = this.createHtmlElement<HTMLDivElement>("div", "resource");

        let icon = this.createHtmlElement<HTMLImageElement>("img", "icon");

        icon.src = satisfactoryIconPath(descriptor.iconPath);
        icon.title = descriptor.displayName;
        icon.alt = descriptor.displayName;
        icon.loading = "lazy";

        let amount = this.createHtmlElement<HTMLParagraphElement>("p", "amount");

        amount.innerText = `${+toItemsInMinute(recipeResource.amount, craftingTime).toFixed(3)}`;

        resourceDiv.appendChild(icon);
        resourceDiv.appendChild(amount);

        parentDiv.appendChild(resourceDiv);
    }

    private updateResourceDisplay(): void
    {
        if (this._selectedRecipe == undefined)
        {
            throw Error("Recipe isn't selected.");
        }

        this._selectedRecipeName.innerText = this._selectedRecipe.recipe.displayName;

        this._selectedRecipeMachine.src = satisfactoryIconPath(this._selectedRecipe.madeIn.iconPath);
        this._selectedRecipeMachine.title = this._selectedRecipe.madeIn.displayName;

        this.updateResources(
            this._selectedRecipeInput,
            this._selectedRecipe.recipe.ingredients
        );
        this.updateResources(
            this._selectedRecipeOutput,
            this._selectedRecipe.recipe.products
        );

        this._selectedRecipePower.innerText = `${this._selectedRecipe.madeIn.powerConsumption} MW`;

        this._selectedRecipeDisplay.classList.remove("hidden");

        this._selectedRecipeDisplay.scrollTop = this._selectedRecipeDisplay.scrollHeight;
    }

    private updateResources(
        container: HTMLDivElement,
        resources: RecipeResource[]
    ): void
    {
        container.querySelectorAll(".resource").forEach(resource => resource.remove());

        resources.forEach(resource => this.createResourceDisplay(
            container,
            this._selectedRecipe!.recipe.manufacturingDuration,
            resource
        ));
    }

    private selectRecipe(recipe: BuildingRecipe, madeIn: Building, recipeSelector: Element)
    {
        this._selectedRecipe = { recipe: recipe, madeIn: madeIn };

        this.dispatchEvent(new Event(RecipeSelectionModal.recipeSelectedEvent));

        recipeSelector.classList.add("selected");
    }

    private discardSelectedRecipe(): void
    {
        this._selectedRecipe = undefined;

        this.dispatchEvent(new Event(RecipeSelectionModal.recipeSelectedEvent));
    }

    private confirmRecipe(): void
    {
        if (this._selectedRecipe != undefined)
        {
            this.closeModal();
            this.dispatchEvent(new Event(RecipeSelectionModal.recipeConfirmedEvent));
        }
    }

    private closeModal(): void
    {
        this._modalContainer.classList.add("hidden");

        this._isOpened = false;
    }

    private createHtmlElement<T = Element>(tag: string, ...classList: string[]): T
    {
        let element = document.createElement(tag);

        element.classList.add(...classList);

        return element as T;
    }

    private _isOpened = false;
    private _selectedRecipe?: { recipe: GameRecipe, madeIn: GameMachine; };

    private _modalContainer = document.querySelector("#node-creation-container") as HTMLDivElement;
    private _closeButton = this._modalContainer.querySelector(".title-row .close") as HTMLDivElement;

    private _gameVersionText = this._modalContainer.querySelector("h2.title span.game-version") as HTMLDivElement;

    private _tabSelectors = this._modalContainer.querySelector("#tab-selectors") as HTMLDivElement;
    private _recipeTabs = this._modalContainer.querySelector("#recipe-tabs") as HTMLDivElement;

    private _selectedRecipeDisplay = this._modalContainer.querySelector("#selected-recipe") as HTMLDivElement;
    private _selectedRecipeName = this._selectedRecipeDisplay.querySelector("#selected-recipe-name>.text") as HTMLDivElement;
    private _selectedRecipeMachine = this._selectedRecipeDisplay.querySelector("#selected-recipe-machine>.machine>img.icon") as HTMLImageElement;
    private _selectedRecipeInput = this._selectedRecipeDisplay.querySelector("#selected-recipe-input") as HTMLDivElement;
    private _selectedRecipeOutput = this._selectedRecipeDisplay.querySelector("#selected-recipe-output") as HTMLDivElement;
    private _selectedRecipePower = this._selectedRecipeDisplay.querySelector("#selected-recipe-power>.text") as HTMLDivElement;

    private _confirmRecipeButton = this._modalContainer.querySelector("#confirm-recipe") as HTMLDivElement;
    private _discardRecipeButton = this._modalContainer.querySelector("#discard-recipe") as HTMLDivElement;
}
