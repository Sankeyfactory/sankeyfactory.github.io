export function satisfactoryIconPath(path: string)
{
    return `GameData/SatisfactoryIcons/${path}`;
}

export function toItemsInMinute(amount: number, consumingTime: number): number
{
    return (60 / consumingTime) * amount;
}
