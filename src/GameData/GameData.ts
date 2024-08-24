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
