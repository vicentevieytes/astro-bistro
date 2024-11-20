import {OrderItemDTO} from "./orderItemDTO.js";

// TODO: THINK OF A BETTER NAME
export class OrderDTO {
    constructor(data) {
        this.orderId = data.order_id;
        this.userId = data.user_id;
        this.username = data.User?.username;
        this.restaurantId = data.restaurant_id;
        this.restaurantName = data.Restaurant?.restaurant_name;
        this.status = data.OrderStatus?.status_name;
        this.createdAt = data.created_at;
        this.items = data.OrderItems?.map(item => new OrderItemDTO(item, data.Restaurant));
    }
}
