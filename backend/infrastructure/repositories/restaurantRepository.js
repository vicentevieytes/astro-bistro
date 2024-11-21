import { Restaurant } from "../../domain/entities/Restaurant.js";

export class RestaurantRepository {
    constructor(models) {
        this.models = models;
    }

    async findAll() {
        const restaurants = await this.models.Restaurant.findAll({
            include: [{
                model: this.models.MenuItem,
                attributes: ['item_id', 'name', 'description', 'price']
            }]
        });

        return restaurants.map(restaurant =>
            new Restaurant(restaurant.get({plain: true}))
        );

    }

    async findById(id) {
        const restaurant = await this.models.Restaurant.findByPk(id, {
            include: [{
                model: this.models.MenuItem,
                attributes: ['item_id', 'restaurant_id', 'name', 'description', 'price']
            }]
        });

        const restaurantData = restaurant.get({ plain: true });

        return restaurant ? new Restaurant(restaurant.get({ plain: true })) : null;
    }

    async create(restaurantData, menuItems) {
        const transaction = await this.models.sequelize.transaction();

        try {
            const restaurant = await this.models.Restaurant.create(restaurantData, {
                transaction
            });

            if (menuItems && menuItems.length > 0) {
                const menuItemsData = menuItems.map(item => ({
                    restaurant_id: restaurant.restaurant_id,
                    name: item.nombre,
                    description: item.descripcion || item.nombre,
                    price: item.precio
                }));

                await this.models.MenuItem.bulkCreate(menuItemsData, {
                    transaction
                });
            }

            await transaction.commit();

            return await this.findById(restaurant.restaurant_id);
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

}