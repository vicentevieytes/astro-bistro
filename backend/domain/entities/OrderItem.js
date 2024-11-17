import { MenuItem as MenuItemEntity } from "./MenuItem.js";

export class OrderItem {
    constructor({
                    order_item_id,
                    order_id,
                    item_id,
                    quantity,
                    price,
                    // comments,
                    MenuItem, // Nested MenuItem from the relation
                    created_at
                }) {
        this.id = order_item_id;
        this.orderId = order_id;
        this.itemId = item_id;
        this.quantity = quantity;
        this.price = price;
        // this.comments = comments; // Uncomment this when you add "comments" to the table schema.
        this.menuItem = MenuItem ? new MenuItemEntity(MenuItem) : null;
        this.createdAt = created_at;
    }

    toJSON() {
        return {
            id: this.id,
            productId: this.itemId,
            name: this.menuItem?.name,
            quantity: this.quantity,
            price: this.price,
            comments: 'Sin comentarios', // this.comments
            createdAt: this.createdAt
        };
    }
}
