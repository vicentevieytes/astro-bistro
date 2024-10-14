export interface Comanda {
    id: number;
    productId: number;
    restaurantId: number;
    quantity: number;
    comments: string;
    product: Producto;
    state: Estado;
}

export interface Restaurante {
    id: number; // Identificador único del restaurante
    name: string; // Nombre del restaurante
    lat: number;
    len: number;
    description: string; // Descripción del restaurante
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