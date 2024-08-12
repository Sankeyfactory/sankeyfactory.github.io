type Recipe = {
    id: string;

    isAlternate: boolean;

    producedIn: string[];
};

type Building = {
    id: string;

    displayName: string;
    description: string;

    powerConsumption: number;
    powerConsumptionExponent: number;
};
