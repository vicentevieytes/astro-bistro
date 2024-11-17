import User from './User.js';
import Restaurant from './Restaurant.js';
import MenuItem from './MenuItem.js';
import OrderStatus from './OrderStatus.js';
import Order from './Order.js';
import OrderStatusHistory from '../../../unused_orm_models/OrderStatusHistory.js';
import OrderItem from './OrderItem.js';

export default function initModels(sequelize) {
    const models = {
        User: User(sequelize),
        Restaurant: Restaurant(sequelize),
        MenuItem: MenuItem(sequelize),
        OrderStatus: OrderStatus(sequelize),
        Order: Order(sequelize),
        OrderStatusHistory: OrderStatusHistory(sequelize),
        OrderItem: OrderItem(sequelize),
        sequelize: sequelize, // xdd?
    };

    // I have to check if this is correct, XD:

    models.Restaurant.hasMany(models.MenuItem, { foreignKey: 'restaurant_id' });
    models.MenuItem.belongsTo(models.Restaurant, { foreignKey: 'restaurant_id' });

    models.User.hasMany(models.Order, { foreignKey: 'user_id' });
    models.Order.belongsTo(models.User, { foreignKey: 'user_id' });

    models.Restaurant.hasMany(models.Order, { foreignKey: 'restaurant_id' });
    models.Order.belongsTo(models.Restaurant, { foreignKey: 'restaurant_id' });

    models.OrderStatus.hasMany(models.Order, { foreignKey: 'status_id' });
    models.Order.belongsTo(models.OrderStatus, { foreignKey: 'status_id' });

    models.Order.hasMany(models.OrderStatusHistory, { foreignKey: 'order_id' });
    models.OrderStatusHistory.belongsTo(models.Order, { foreignKey: 'order_id' });

    models.OrderStatus.hasMany(models.OrderStatusHistory, { foreignKey: 'status_id' });
    models.OrderStatusHistory.belongsTo(models.OrderStatus, { foreignKey: 'status_id' });

    models.Order.hasMany(models.OrderItem, { foreignKey: 'order_id' });
    models.OrderItem.belongsTo(models.Order, { foreignKey: 'order_id' });

    models.MenuItem.hasMany(models.OrderItem, { foreignKey: 'item_id' });
    models.OrderItem.belongsTo(models.MenuItem, { foreignKey: 'item_id' });

    return models;
}
