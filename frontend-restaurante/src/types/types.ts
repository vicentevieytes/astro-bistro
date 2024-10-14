export interface Comanda {
    id: string;
    dish_name: string;
    quantity: number;
    total_price: string; // O puedes usar `number` si prefieres trabajar con números
}

export interface Restaurante {
    id: string; // Identificador único del restaurante
    name: string; // Nombre del restaurante
    lat: string;
    len: string;
    description: string; // Descripción del restaurante
}