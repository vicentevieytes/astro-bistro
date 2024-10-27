import { DataTypes } from 'sequelize';

export default (sequelize) => {
    return sequelize.define('Restaurant', {
        restaurant_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        restaurant_name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        description: DataTypes.TEXT,
        latitude: DataTypes.DECIMAL(10, 8),
        longitude: DataTypes.DECIMAL(11, 8),
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'restaurants',
        timestamps: false
    });
};
