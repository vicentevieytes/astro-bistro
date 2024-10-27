export enum OrderStatus {
    Pending = "Pending",           // Initial state before acceptance
    Accepted = "Accepted",
    Rejected = "Rejected",
    InPreparation = "En preparación",
    ReadyForPickup = "Listo para ser retirado",
    ReadyToServe = "Pronto a ser servido"
}

export interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    status: OrderStatus;
}
