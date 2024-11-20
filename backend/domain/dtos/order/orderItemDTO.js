export class OrderItemDTO {
    constructor(data) {
        this.id = data.id; // It's the order_id, not order_item_id
        this.name = data.name;
        this.price = data.price;
        this.quantity = data.quantity;
        this.status = data.status;
        this.restaurantId = data.restaurantId;
        this.restaurantName = data.restaurantName;
    }

}