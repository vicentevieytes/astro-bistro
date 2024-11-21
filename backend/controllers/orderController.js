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

    async getOrderStatuses(req, res, next) {
        try {
            const statuses = await this.service.getOrderStatuses();
            console.log(statuses);
            res.json(statuses);
        } catch (error) {
            next(error);
        }
    }


}