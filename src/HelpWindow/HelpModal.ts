import { HelpPlaceholders } from "./HelpPlaceholders";

export class HelpModal
{
    constructor()
    {
        this.replaceHelpPlaceholders();

        HelpModal._openModalButton.addEventListener("click", (event) =>
        {
            if (!this._isOpened)
            {
                event.stopPropagation();
                this.openModal();
            }
        });

        HelpModal._closeButton.addEventListener("click", (event) =>
        {
            if (this._isOpened)
            {
                event.stopPropagation();
                this.closeModal();
            }
        });

        window.addEventListener("keydown", (event) =>
        {
            if (event.code === "Escape" && this._isOpened)
            {
                event.stopPropagation();
                event.preventDefault();
                this.closeModal();
            }
        });
    }

    private openModal(): void
    {
        HelpModal._modalContainer.classList.remove("hidden");
        this._isOpened = true;
    }

    private closeModal(): void
    {
        HelpModal._modalContainer.classList.add("hidden");
        this._isOpened = false;
    }

    private replaceHelpPlaceholders(): void
    {
        let placeholders = document.querySelectorAll<HTMLTableRowElement>("tr.help-placeholder");

        for (const placeholder of placeholders)
        {
            this.replacePlaceholder(placeholder);
        }
    }

    private replacePlaceholder(placeholderRow: HTMLTableRowElement): void
    {
        let td = placeholderRow.querySelector("td")!;
        td.remove();

        placeholderRow.append(...HelpPlaceholders.parsePlaceholder(td.innerText));

        placeholderRow.classList.remove("help-placeholder");
    };

    private _isOpened = false;

    private static _modalContainer = document.querySelector("#help-modal-container") as HTMLDivElement;
    private static _closeButton = this._modalContainer.querySelector(".title-row .close") as HTMLDivElement;
    private static _openModalButton = document.querySelector("#open-help") as HTMLDivElement;
}

