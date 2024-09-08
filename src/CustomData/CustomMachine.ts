import { Machine } from "../Machine";

export class CustomMachine implements Machine
{
    public constructor(
        public iconPath: string,
        public displayName: string,
        public powerConsumption: number,
        public powerConsumptionExponent: number = 1,
    ) { }

    public static getPlaceholderMachine(displayName: string, customPower: number): CustomMachine {
        // Temp placeholder.
        return new CustomMachine("Buildable/Factory/SmelterMk1/SmelterMk1.png", displayName, customPower);
    }
}
