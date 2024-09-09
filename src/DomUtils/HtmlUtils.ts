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

    private constructor() { }
}
