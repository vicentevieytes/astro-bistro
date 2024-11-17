import { DataTypes } from 'sequelize';

export default (sequelize) => {
    return sequelize.define('OrderStatusHistory', {
        history_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        order_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Order',
                key: 'order_id'
            }
        },
        status_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'OrderStatus',
                key: 'status_id'
            }
        },
        changed_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'order_status_history',
        timestamps: false
    });
};
