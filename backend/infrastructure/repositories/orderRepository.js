import {Order} from "../../domain/entities/Order.js";
// import {OrderDTO} from "../../domain/dtos/order/orderDTO.js";
import {OrderStatus} from "../../domain/entities/OrderStatus.js";
import {OrderItemDTO} from "../../domain/dtos/order/orderItemDTO.js";
import {OrderWithUpdatedStatusDTO} from "../../domain/dtos/order/orderWithUpdatedStatusDTO.js";

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

    async findOrderItemsById(orderId) {
        const order = await this.models.Order.findByPk(orderId, {
            include: [
                {
                    model: this.models.OrderItem,
                    include: [{ model: this.models.MenuItem }],
                },
                { model: this.models.Restaurant },
                { model: this.models.OrderStatus },
                // { model: this.models.User },
            ],
        });

        const fullOrderData = order.get({ plain: true });

        return fullOrderData.OrderItems.map(orderItem => {
            const dtoData = {
                id: orderItem.order_id,
                name: orderItem.MenuItem?.name,
                price: orderItem.price,
                quantity: orderItem.quantity,
                status: fullOrderData.OrderStatus?.status_name,
                restaurantId: fullOrderData.Restaurant?.restaurant_id,
                restaurantName: fullOrderData.Restaurant?.restaurant_name,
            };
            return new OrderItemDTO(dtoData);
        });
    }

    async findOrderItemsByUserId(userId) {
        const orders = await this.models.Order.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: this.models.OrderItem,
                    include: [{ model: this.models.MenuItem }],
                },
                { model: this.models.Restaurant },
                { model: this.models.OrderStatus },
                // { model: this.models.User },
            ],
            order: [['created_at', 'DESC']],
        });

        return orders.flatMap(order => {
            const fullOrderData = order.get({ plain: true });
            return fullOrderData.OrderItems.map(orderItem => new OrderItemDTO({
                id: orderItem.order_id,
                name: orderItem.MenuItem?.name,
                price: orderItem.price,
                quantity: orderItem.quantity,
                status: fullOrderData.OrderStatus?.status_name,
                restaurantId: fullOrderData.Restaurant?.restaurant_id,
                restaurantName: fullOrderData.Restaurant?.restaurant_name,
            }));
        });
    }

    async findById(orderId) {
        const order = await this.models.Order.findByPk(orderId, {
            include: [
                {
                    model: this.models.OrderItem,
                    include: [{ model: this.models.MenuItem }],
                },
                { model: this.models.Restaurant },
                { model: this.models.OrderStatus },
                { model: this.models.User },
            ],
        });

        return order ? new Order(order.get({ plain: true })) : null;
    }

    async updateStatus(orderId, statusId) {
        await this.models.Order.update(
            { status_id: statusId },
            { where: { order_id: orderId } }
        );
        const order = await this.findById(orderId);

        console.log(order);

        return order ? new OrderWithUpdatedStatusDTO(order.id, order.status.statusName) : null;
    }

    async findStatusById(statusId) {
        console.log(statusId);
        const status = await this.models.OrderStatus.findByPk(statusId);

        console.log(status);
        return status ? new OrderStatus(status.get({ plain: true })) : null;
    }

    async findPendingStatus() {
        const status = await this.models.OrderStatus.findOne({
            where: { status_name: 'Aguardando aceptación' }
        });
        return status ? new OrderStatus(status.get({ plain: true })) : null;
    }

    async createOrder(orderData) {
        const transaction = await this.models.sequelize.transaction();

        try {
            const order = await this.models.Order.create({
                user_id: orderData.userId,
                restaurant_id: orderData.restaurantId,
                status_id: orderData.statusId
            }, { transaction });

            const orderItemsData = orderData.items.map(item => ({
                order_id: order.order_id,
                item_id: item.id,
                quantity: item.quantity,
                price: item.price
            }));

            await this.models.OrderItem.bulkCreate(orderItemsData, { transaction });

            await transaction.commit();
            return order;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async findOrderStatuses() {
        const statuses = await this.models.OrderStatus.findAll({
            attributes: ['status_id', 'status_name'],
        });
        console.log(statuses);
        console.log("B")
        return statuses.map(status => new OrderStatus(status.get({ plain: true })))
    }

}
