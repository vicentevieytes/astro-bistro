export class CreateOrderDTO {
    constructor(data) {
        this.userId = data.userId;
        this.restaurantId = data.restaurantId;
        this.items = data.items.map(item => ({
            id: item.id,
            quantity: item.quantity,
            price: item.price
        }));
    }
}
