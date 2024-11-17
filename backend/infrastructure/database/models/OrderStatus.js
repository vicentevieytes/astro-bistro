import { DataTypes } from 'sequelize';

export default (sequelize) => {
    return sequelize.define('OrderStatus', {
        status_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        status_name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        }
    }, {
        tableName: 'order_statuses',
        timestamps: false
    });
};
