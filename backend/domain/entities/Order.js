import { OrderItem } from "./OrderItem.js";
import { OrderStatus as OrderStatusEntity } from "./OrderStatus.js";
import { User as UserEntity } from "./User.js";

export class Order {
    constructor({
                    order_id,
                    restaurant_id,
                    created_at,
                    User,
                    OrderStatus,
                    OrderItems = []
                }) {
        this.id = order_id;
        this.restaurantId = restaurant_id;
        this.createdAt = created_at;
        this.user = User ? new UserEntity(User) : null;
        this.status = OrderStatus ? new OrderStatusEntity(OrderStatus) : null;
        this.items = OrderItems.map(item => new OrderItem(item));
    }

    toJSON() {
        return {
            id: this.id,
            user: this.user.username,
            status: this.status.statusName,
            items: this.items.map(item => ({
                productId: item.itemId,
                name: item.menuItem.name,
                quantity: item.quantity,
                comments: item.comments || 'Sin comentarios',
            })),
            created_at: this.createdAt
        };
    }
}
