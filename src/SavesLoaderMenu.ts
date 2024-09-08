import { AppData } from "./AppData";
import { FactoryImporter } from "./FactoryImporter";
import { SvgIcons } from "./SVG/SvgIcons";

export class SavesLoaderMenu
{
    public constructor()
    {
        this.configurePlanCreationInput();
        this.configureLoadedPlanElement();

        this.updatePlanSelectors();

        this._loadedPlanElement.addEventListener("click", (event) =>
        {
            event.stopPropagation();

            if (this._isOpened)
            {
                this.close();
            }
            else
            {
                this.open();
            }
        });

        this._nonePlanSelector.addEventListener("click", (event) =>
        {
            event.stopPropagation();
            AppData.instance.loadDatabasePlan("");
            this.close();
        });

        let updateSelectedState = () =>
        {
            if (AppData.instance.currentPlanName === "")
            {
                this._nonePlanSelector.classList.add("selected");
            }
            else
            {
                this._nonePlanSelector.classList.remove("selected");
            }
        };

        updateSelectedState();

        AppData.instance.addEventListener(AppData.databasePlanSelectionChangedEvent, () =>
        {
            updateSelectedState();
        });

        // Clicking outside the menu should close it.
        this._savesLoaderElement.addEventListener("click", e => e.stopPropagation());
        window.addEventListener("click", () => this.close());

        window.addEventListener("keydown", (event) =>
        {
            if (event.key === "Escape" && this._isOpened)
            {
                event.stopPropagation();
                event.preventDefault();
                this.close();
            }
        });
    }

    private open(): void
    {
        if (!this._isOpened)
        {
            this._savesLoaderElement.classList.remove("collapsed");
            this._savesLoaderElement.classList.add("expanded");

            this._isOpened = true;
        }
    }

    private close(): void
    {
        if (this._isOpened)
        {
            this._savesLoaderElement.classList.remove("expanded");
            this._savesLoaderElement.classList.add("collapsed");

            this._isOpened = false;
        }
    }

    private updatePlanSelectors(): void
    {
        let oldSelectors = this._planSelectors.querySelectorAll(".plan-selector");

        for (const selector of oldSelectors)
        {
            if (selector.id !== "none-plan-selector")
            {
                selector.remove();
            }
        }

        for (const planName of AppData.instance.databasePlanNames)
        {
            if (planName !== "")
            {
                this._planSelectors.appendChild(this.createPlanSelector(planName));
            }
        }
    }

    private configurePlanCreationInput(): void
    {
        let clearPlanCreationInput = this._savesLoaderElement.querySelector(".create-new .clear-button") as HTMLDivElement;

        clearPlanCreationInput.addEventListener("click", () =>
        {
            this._planCreationInput.value = "";
        });

        this._planCreationInput.value = "";

        let createPlan = () =>
        {
            let planName = this._planCreationInput.value;
            AppData.instance.createAndSelectDatabasePlan(planName);

            this._planSelectors.appendChild(this.createPlanSelector(planName));

            this._planCreationInput.value = "";

            this.close();
        };

        this._planCreationButton.addEventListener("click", () =>
        {
            createPlan();
        });

        this._planCreationInput.addEventListener("keydown", (event) =>
        {
            event.stopPropagation();

            if (event.key === "Enter")
            {
                createPlan();
            }

            if (event.key === "Escape" && this._isOpened)
            {
                event.stopPropagation();
                event.preventDefault();
                this.close();
            }
        });

        this._planCreationInput.addEventListener("keypress", (event) => event.stopPropagation());
    }

    private configureLoadedPlanElement(): void
    {
        let loadedPlanNameElement = this._loadedPlanElement.querySelector(".plan-name") as HTMLDivElement;

        let updateName = () =>
        {
            let planName = AppData.instance.currentPlanName;

            if (planName === "")
            {
                loadedPlanNameElement.innerText = "Load plan";
                loadedPlanNameElement.classList.add("placeholder");
            }
            else
            {
                loadedPlanNameElement.innerText = planName;
                loadedPlanNameElement.classList.remove("placeholder");
            }
        };

        updateName();

        AppData.instance.addEventListener(AppData.databasePlanSelectionChangedEvent, () =>
        {
            updateName();
        });
    }

    private createPlanSelector(name: string): HTMLDivElement
    {
        let createHtmlElement = (tag: string, ...classList: string[]) =>
        {
            let element = document.createElement(tag);
            element.classList.add(...classList);
            return element;
        };

        let planSelector = createHtmlElement("div", "plan-selector") as HTMLDivElement;
        let planNameElement = createHtmlElement("div", "plan-name");
        let importButton = createHtmlElement("div", "import-button");
        let deleteButton = createHtmlElement("div", "delete-button");

        planNameElement.innerText = name;
        importButton.appendChild(SvgIcons.createIcon("plus"));
        deleteButton.appendChild(SvgIcons.createIcon("delete"));

        planSelector.appendChild(planNameElement);
        planSelector.appendChild(importButton);
        planSelector.appendChild(deleteButton);

        planNameElement.addEventListener("click", (event) =>
        {
            event.stopPropagation();
            AppData.instance.loadDatabasePlan(name);
            this.close();
        });

        importButton.addEventListener("click", (event) =>
        {
            FactoryImporter.importSavedFactory(name);
            this.close();
        });

        deleteButton.addEventListener("click", (event) =>
        {
            event.stopPropagation();

            if (confirm(
                "Are you sure that you want to delete this factory plan?\n"
                + "This will delete all nodes and connections from it.\n"
                + "All data of the plan will be lost."))
            {
                AppData.instance.deleteDatabasePlan(name);
                planSelector.remove();
                this.close();
            }
        });

        let updateSelectedState = () =>
        {
            if (name === AppData.instance.currentPlanName)
            {
                planSelector.classList.add("selected");
                importButton.classList.add("hidden");
            }
            else
            {
                planSelector.classList.remove("selected");
                importButton.classList.remove("hidden");
            }
        };

        updateSelectedState();

        AppData.instance.addEventListener(AppData.databasePlanSelectionChangedEvent, () =>
        {
            updateSelectedState();
        });

        return planSelector;
    }

    private _isOpened = false;

    private readonly _savesLoaderElement = document.querySelector("#saves-loader") as HTMLDivElement;

    private readonly _loadedPlanElement = this._savesLoaderElement.querySelector(".loaded-plan") as HTMLDivElement;
    private readonly _nonePlanSelector = this._savesLoaderElement.querySelector("#none-plan-selector") as HTMLDivElement;
    private readonly _planSelectors = this._savesLoaderElement.querySelector(".plan-selectors") as HTMLDivElement;
    private readonly _planCreationInput = this._savesLoaderElement.querySelector(".create-new input") as HTMLInputElement;
    private readonly _planCreationButton = this._savesLoaderElement.querySelector(".create-new .create-button") as HTMLInputElement;
}
