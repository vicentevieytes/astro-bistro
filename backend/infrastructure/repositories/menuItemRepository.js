import { MenuItem } from "../../domain/entities/MenuItem.js";

export class MenuItemRepository {
    constructor(models) {
        this.models = models;
    }

    async findByRestaurantId(restaurantId) {
        const items = await this.models.MenuItem.findAll({
            where: { restaurant_id: restaurantId }
        });
        return items.map(item => new MenuItem(item.get({ plain: true })));
    }

}