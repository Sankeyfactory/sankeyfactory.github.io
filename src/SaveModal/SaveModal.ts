import { AppData } from "../AppData";
import { FactoryStorage } from "../FactoryStorage";

export class SaveModal
{
    private static _saveFactoryButton = document.querySelector("#save-factory") as HTMLDivElement;
    private static _saveFactoryModalButton = document.querySelector("#save-factory-modal-button") as HTMLDivElement;
    private static _factoryNameInput = document.querySelector("#new-factory-name") as HTMLInputElement;
    private static _saveSelect = document.querySelector("#save-name") as HTMLSelectElement
    private static _modalContainer = document.querySelector("#save-modal-container") as HTMLDivElement;
    private static _closeButton = this._modalContainer.querySelector(".title-row .close") as HTMLDivElement;
    private static saveNewText = "Save New Factory";
    private static disableLoading = false;

    private _isOpened = false;

    public static readonly isSaveButton = "canvas-locked-changed";
    public static readonly isGridEnabledChangedEvent = "grid-enabled-changed";
    public static readonly zoomChangedEvent = "canvas-locked-changed";
    public static readonly connectingResourceIdChangedEvent = "connecting-resource-id-changed";

    public static get instance()
    {
        return this._instance;
    }

    public openModal(): void
    {
        SaveModal._modalContainer.classList.remove("hidden");
        SaveModal._factoryNameInput.focus();
        this._isOpened = true;
    }

    private closeModal(): void
    {
        SaveModal._modalContainer.classList.add("hidden");
        this._isOpened = false;
    }

    private saveFactory(factoryName: string): void
    {
        // Prevent the user from breaking their ability to create new Saves
        if (factoryName == SaveModal.saveNewText)
        {
            factoryName = "New Factory (1)";
        }
        FactoryStorage.instance.saveFactory(factoryName, () =>
        {
            this.updateFactoryNameDropdown(factoryName);
        })
    }

    public updateFactoryNameDropdown(currentlyLoadedFactory: string): void
    {
        SaveModal.disableLoading = true;
        // Update the name in the dropdown
        let saveSelect = SaveModal._saveSelect
        var i, L = saveSelect.options.length - 1;
        for(i = L; i >= 0; i--) {
            saveSelect.remove(i);
        }
        let factoryNames = FactoryStorage.instance.getSavedFactoryNames();
        let foundMatchingName = false;
        factoryNames.forEach((factoryName) => {
            let newOption = document.createElement("option");
            newOption.value = factoryName;
            newOption.text = factoryName;
            if (factoryName == currentlyLoadedFactory)
            {
                newOption.selected = true;
                foundMatchingName = true;
            }
            saveSelect.options.add(newOption);
        });
        let saveNewOption = document.createElement("option");
        saveNewOption.value = SaveModal.saveNewText;
        saveNewOption.text = SaveModal.saveNewText;
        if (!foundMatchingName)
        {
            saveNewOption.selected = true;
        }
        saveSelect.options.add(saveNewOption);

        SaveModal.disableLoading = false;
    }

    constructor()
    {
        SaveModal._saveFactoryModalButton.addEventListener("click", (event) =>
        {
            // Event from the Save Factory Modal (i.e. this is a new save)
            event.stopPropagation();
            let newName = SaveModal._factoryNameInput.value || "Unnamed Save"
            this.saveFactory(newName);
            this.closeModal();
        });
        SaveModal._saveFactoryButton.addEventListener("click", (event) =>
        {
            // Event from the Save button on the main canvas (existing save or launching modal for new save)
            event.stopPropagation();
            let saveSelect = SaveModal._saveSelect
            let idx = saveSelect.selectedIndex;
            let selectedOption = saveSelect.options[idx];
            let factoryName = selectedOption.text || "Unnamed Save"
            // If this is a new save, open the modal
            if (factoryName == SaveModal.saveNewText) {
                this.openModal();
                return;
            }
            // Otherwise, update the save of the factory
            this.saveFactory(factoryName);
        });
        SaveModal._closeButton.addEventListener("click", (event) =>
        {
            if (this._isOpened)
            {
                event.stopPropagation();
                this.closeModal();
            }
        });
        SaveModal._saveSelect.onchange = function(event) {
            let saveSelect = SaveModal._saveSelect
            let idx = saveSelect.selectedIndex;
            let selectedOption = saveSelect.options[idx];
            let factoryName = selectedOption.text || "Unnamed Save"
            // If this is a new save, open the modal
            if (factoryName == SaveModal.saveNewText) {
                SaveModal.instance.openModal();
                return;
            }
            // Otherwise, load the selected option
            if (SaveModal.disableLoading)
            {
                return;
            }
            AppData.loadFromDatabase(factoryName);
        };
        window.addEventListener("keydown", (event) =>
        {
            if (event.code === "Escape" && this._isOpened)
            {
                event.stopPropagation();
                event.preventDefault();
                this.closeModal();
            }
        });

        SaveModal._modalContainer.querySelector(".modal-window")!.addEventListener("click", (event) =>
        {
            event.stopPropagation();
        });
        SaveModal._modalContainer.querySelector(".modal-window")!.addEventListener("mousedown", (event) =>
        {
            event.stopPropagation();
        })

        SaveModal._modalContainer.addEventListener("mousedown", (event) =>
        {
            event.stopPropagation();
            this.closeModal();
        });
    }

    private static readonly _instance = new SaveModal();

}
