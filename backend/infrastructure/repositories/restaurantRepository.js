import { Restaurant } from "../../domain/entities/Restaurant.js";

export class RestaurantRepository {
    // TODO: Maybe add a cache...
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
                attributes: ['item_id', 'name', 'description', 'price']
            }]
        });

        console.log(restaurant.MenuItems[0]);

        const restaurantData = restaurant.get({ plain: true });
        console.log(restaurantData);

        console.log("LALAL")

        const restaurantObj = new Restaurant(restaurantData);

        console.log(restaurantObj)

        console.log("LELELEL")


        return restaurant ? new Restaurant(restaurant.get({ plain: true })) : null;
    }

    async create(restaurantData, menuItems) {
        const transaction = await this.models.sequelize.transaction();

        try {
            const restaurant = await this.models.Restaurant.create(restaurantData, {
                transaction
            });

            if (menuItems && menuItems.length > 0) {
                // TODO: Call the MenuItemRepository here???
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