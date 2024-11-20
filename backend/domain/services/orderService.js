import {OrderWithUpdatedStatusDTO} from "../dtos/order/orderWithUpdatedStatusDTO.js";

export class OrderService {
    constructor(orderRepository) {
        this.repository = orderRepository;
    }

    async getRestaurantOrders(restaurantId) {
        return await this.repository.findByRestaurantId(restaurantId);
    }

    async updateOrderStatus(orderId, statusId) {
        const order = await this.repository.findById(orderId);
        if (!order) {
            throw new Error('Order not found');
        }

        const status = await this.repository.findStatusById(statusId);
        if (!status) {
            throw new Error('Invalid status');
        }

        // const orderWithUpdatedStatus = await this.repository.updateStatus(orderId, statusId);

        // console.log(updatedOrder);
        // console.log("A");

        return await this.repository.updateStatus(orderId, statusId);
    }

    async getOrdersByUsedId(userId) {
        return await this.repository.findOrderItemsByUserId(userId);
    }

    async createOrder(createOrderDTO) {
        try {
            const pendingStatus = await this.repository.findPendingStatus();
            if (!pendingStatus) {
                throw new Error('Pending status not found');
            }

            const order = await this.repository.createOrder({
                userId: createOrderDTO.userId,
                restaurantId: createOrderDTO.restaurantId,
                statusId: pendingStatus.id,
                items: createOrderDTO.items
            });

            return await this.repository.findOrderItemsById(order.order_id);
        } catch (error) {
            console.error('Error in createOrder service:', error);
            throw error;
        }
    }

}
