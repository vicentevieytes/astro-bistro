export interface Comanda {
    id: number;
    productId: number;
    restaurantId: number;
    quantity: number;
    comments: string;
    product: Producto;
    state: Estado;
}

// TODO: Standardize all of these interfaces between frontend-consumidor and frontend-restaurante

export interface Restaurante {
    restaurant_id: number;
    restaurant_name: string;
    description: string;
    latitude: string;
    longitude: string;
    created_at: string;
}

export interface Producto {
    id: number;
    restaurant_id: number;
    name: string;
    price: number;
    description: string;
}

export interface Estado {
    id: number;
    description: string;
}