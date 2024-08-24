export class ResourcesSummary
{
    constructor()
    {
        ResourcesSummary._collapseButton.addEventListener("click", () =>
        {
            if (this._isCollapsed)
            {
                ResourcesSummary._summaryContainer.classList.remove("collapsed");
                ResourcesSummary._summaryContainer.style.top = "0";
            }
            else
            {
                ResourcesSummary._summaryContainer.classList.add("collapsed");

                let contentHeight = ResourcesSummary.querySuccessor(".content").clientHeight;

                console.log(contentHeight);

                ResourcesSummary._summaryContainer.style.top = `${-contentHeight}px`;
            }

            this._isCollapsed = !this._isCollapsed;
        });
    }

    private static querySuccessor(query: string): Element
    {
        let fullQuery = `#${ResourcesSummary._summaryContainer.id} ${query}`;
        let element = document.querySelector(fullQuery);

        if (element == null)
        {
            throw Error(`Couldn't find required element: ${fullQuery}`);
        }

        return element;
    }

    private _isCollapsed = false;

    private static readonly _summaryContainer =
        document.querySelector("#resources-summary") as HTMLDivElement;
    private static readonly _collapseButton =
        ResourcesSummary.querySuccessor(".collapse-button") as HTMLDivElement;
}
