import { HtmlUtils } from "../DomUtils/HtmlUtils";
import { SvgIcons } from "../DomUtils/SvgIcons";

export class HelpPlaceholders
{
    public static parsePlaceholder(text: string): Node[]
    {
        let nodes: Node[] = [];
        let parsingTag: string | undefined;
        let parsingStartIndex = 0;

        let pushText = (text: string) =>
        {
            if (text != "")
            {
                nodes.push(document.createTextNode(text));
            }
        };

        for (let i = 0; i < text.length; ++i)
        {
            let currentSymbol = text[i];
            if (this._tagsMap.has(currentSymbol))
            {
                if (parsingTag == undefined)
                {
                    pushText(text.slice(parsingStartIndex, i));

                    parsingTag = currentSymbol;
                    parsingStartIndex = i + 1;
                }
                else if (parsingTag === currentSymbol)
                {
                    let innerContent = text.slice(parsingStartIndex, i);

                    let action = this._tagsMap.get(currentSymbol)!;

                    nodes.push(action(innerContent));

                    parsingTag = undefined;
                    parsingStartIndex = i + 1;
                }
            }
        }

        pushText(text.slice(parsingStartIndex));

        return nodes;
    }

    private static createControls(content: string): Node
    {
        let cell = HtmlUtils.createHtmlElement("td");

        let controls = HtmlUtils.createHtmlElement("div", "controls");
        controls.append(...this.parsePlaceholder(content));

        cell.appendChild(controls);

        return cell;
    }

    private static createButton(content: string): Node
    {
        let buttonTip = HtmlUtils.createHtmlElement("div", "button-tip");
        buttonTip.append(...this.parsePlaceholder(content));

        return buttonTip;
    }

    private static createIcon(content: string): Node
    {
        return SvgIcons.createIcon(content);
    }

    private static createDescription(content: string): Node
    {
        let cell = HtmlUtils.createHtmlElement("td");
        cell.append(...this.parsePlaceholder(content));

        return cell;
    }

    private static _tagsMap = new Map<string, (content: string) => Node>([
        ["$", this.createControls.bind(this)],
        ["|", this.createButton.bind(this)],
        ["%", this.createIcon.bind(this)],
        ["=", this.createDescription.bind(this)],
    ]);
}
