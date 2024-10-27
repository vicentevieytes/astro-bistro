interface restaurante {
    restaurant_id: number;
    restaurant_name: string;
    description: string;
    latitude: string;
    longitude: string;
    created_at: string;
}

interface itemMenu {
    item_id: number;
    restaurant_id: number;
    name: string;
    description: string;
    price: string;
}

export type { restaurante, itemMenu };
