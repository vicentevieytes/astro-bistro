import { DataTypes } from 'sequelize';

export default (sequelize) => {
    return sequelize.define('Order', {
        order_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'User',
                key: 'user_id'
            }
        },
        restaurant_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Restaurant',
                key: 'restaurant_id'
            }
        },
        status_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'OrderStatus',
                key: 'status_id'
            }
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'orders',
        timestamps: false
    });
};
