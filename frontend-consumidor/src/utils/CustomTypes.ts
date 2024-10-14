interface restaurante {
    id: number;
    name: string;
    lat: string;
    len: string;
    description: string;
}

interface itemMenu {
    id: number;
    restaurant_id: number;
    name: string;
    price: string;
    description: string;
}

export type { restaurante, itemMenu };
