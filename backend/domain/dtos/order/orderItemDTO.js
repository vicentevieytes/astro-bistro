// TODO: THINK OF A BETTER NAME
export class OrderItemDTO {
    constructor(data, restaurant) {
        this.orderItemId = data.order_item_id;
        this.itemId = data.item_id;
        this.name = data.MenuItem?.name;
        this.quantity = data.quantity;
        this.price = data.price;
        // Include restaurant info at item level as per original implementation
        this.restaurantId = restaurant?.restaurant_id;
        this.restaurantName = restaurant?.restaurant_name;
    }
}
