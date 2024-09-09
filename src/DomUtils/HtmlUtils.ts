export class HtmlUtils
{
    public static createHtmlElement<K extends keyof HTMLElementTagNameMap>(tagName: K, ...classes: string[])
        : HTMLElementTagNameMap[K];

    public static createHtmlElement(tag: string, ...classes: string[]): HTMLElement
    {
        let element = document.createElement(tag);

        element.classList.add(...classes);

        return element;
    }

    public static toggleClass(element: Element, className: string, toggleOn: boolean)
    {
        if (toggleOn)
        {
            element.classList.add(className);
        }
        else
        {
            element.classList.remove(className);
        }
    }

    private constructor() { }
}
