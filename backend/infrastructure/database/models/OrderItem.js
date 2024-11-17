import { DataTypes } from 'sequelize';

export default (sequelize) => {
    return sequelize.define('OrderItem', {
        order_item_id: {
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
        item_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'MenuItem',
                key: 'item_id'
            }
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'order_items',
        timestamps: false
    });
};
