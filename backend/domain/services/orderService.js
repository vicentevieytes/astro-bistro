export class OrderService {
    constructor(orderRepository) {
        this.repository = orderRepository;
    }

    async getRestaurantOrders(restaurantId) {
        return await this.repository.findByRestaurantId(restaurantId);
    }
}
