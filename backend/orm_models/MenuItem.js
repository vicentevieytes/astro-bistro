import { DataTypes } from 'sequelize';

export default (sequelize) => {
    return sequelize.define('MenuItem', {
        item_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        restaurant_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Restaurant',
                key: 'restaurant_id'
            }
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        description: DataTypes.TEXT,
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'menu_items',
        timestamps: false
    });
};
