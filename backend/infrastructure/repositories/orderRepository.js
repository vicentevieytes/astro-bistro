import {Order} from "../../domain/entities/Order.js";
import {OrderDTO} from "../../domain/dtos/order/orderDTO.js";
import {OrderStatus} from "../../domain/entities/OrderStatus.js";

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

    async findById(orderId) {
        const order = await this.models.Order.findByPk(orderId, {
            include: [
                {
                    model: this.models.OrderItem,
                    include: [{ model: this.models.MenuItem }],
                },
                { model: this.models.OrderStatus },
                { model: this.models.User },
            ],
        });

        // TODO: Think of a better name for "OrderDTO"
        return order ? new OrderDTO(order.get({ plain: true })) : null;
    }

    async updateStatus(orderId, statusId) {
        await this.models.Order.update(
            { status_id: statusId },
            { where: { order_id: orderId } }
        );
        return this.findById(orderId);
    }

    async findStatusById(statusId) {
        console.log(statusId);
        const status = await this.models.OrderStatus.findByPk(statusId);

        console.log(status);
        return status ? new OrderStatus(status.get({ plain: true })) : null;
    }
}
