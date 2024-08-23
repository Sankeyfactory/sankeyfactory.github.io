export class Configurators
{
    public inputsConfigurators = new Array<HTMLDivElement>;
    public outputsConfigurators = new Array<HTMLDivElement>;
    public powerConfigurator?: HTMLDivElement;

    public removeFromDom(): void
    {
        for (const configurator of this.inputsConfigurators)
        {
            configurator.remove();
        }

        for (const configurator of this.outputsConfigurators)
        {
            configurator.remove();
        }

        if (this.powerConfigurator != undefined)
        {
            this.powerConfigurator.remove();
        }
    }
};
