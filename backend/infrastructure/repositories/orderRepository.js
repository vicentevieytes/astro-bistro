import {Order} from "../../domain/entities/Order.js";

export class OrderRepository {
    constructor(models) {
        this.models = models;
    }

    async findByRestaurantId(restaurantId) {
        const orders = await this.models.Order.findAll({
            where: { restaurant_id: restaurantId },
            include: [
                {
                    model: this.models.OrderItem,
                    include: [
                        {
                            model: this.models.MenuItem,
                            attributes: ['name'],
                        },
                    ],
                },
                {
                    model: this.models.OrderStatus,
                    attributes: ['status_name'],
                },
                {
                    model: this.models.User,
                    attributes: ['username'],
                },
            ],
            order: [['created_at', 'DESC']],
        });

        return orders.map(order => new Order(order.get({ plain: true })));
    }
}
