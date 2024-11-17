export class OrderController {
    constructor(orderService) {
        this.service = orderService;
    }

    async getOrders(req, res, next) {
        try {
            const restaurantId = req.params.id;

            const orders = await this.service.getRestaurantOrders(restaurantId);
            res.json(orders);
        } catch (error) {
            next(error);
        }
    }
}