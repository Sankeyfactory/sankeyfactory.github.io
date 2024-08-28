export function satisfactoryIconPath(path: string): string
{
    return `GameData/SatisfactoryIcons/${path}`;
}

export function toItemsInMinute(amount: number, consumingTime: number): number
{
    return (60 / consumingTime) * amount;
}

export function overclockPower(power: number, overclockRatio: number, powerExponent: number): number
{
    return power * Math.pow(overclockRatio, powerExponent);
}

export function overclockToShards(overclockRatio: number): number
{
    if (overclockRatio <= 1)
    {
        return 0;
    }

    return Math.ceil((overclockRatio - 1) / 0.5);
}
