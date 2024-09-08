import { Machine } from "../Machine";

export class GameMachine implements Machine
{
    public constructor(
        public iconPath: string,
        public displayName: string,
        public powerConsumption: number,
        public powerConsumptionExponent: number,
    ) { }
}
