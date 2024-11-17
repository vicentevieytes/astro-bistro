import { DataTypes } from 'sequelize';

export default (sequelize) => {
    return sequelize.define(
        'Restaurant',
        {
            restaurant_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            restaurant_name: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            description: DataTypes.TEXT,
            latitude: DataTypes.DECIMAL(10, 8),
            longitude: DataTypes.DECIMAL(11, 8),
            logo: DataTypes.BLOB('long'),
            image0: DataTypes.BLOB('long'),
            image1: DataTypes.BLOB('long'),
            image2: DataTypes.BLOB('long'),
            image3: DataTypes.BLOB('long'),
            image4: DataTypes.BLOB('long'),
            created_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            tableName: 'restaurants',
            timestamps: false,
        },
    );
};
