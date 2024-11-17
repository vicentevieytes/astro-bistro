export class MenuItemService {
    constructor(menuItemRepository) {
        this.repository = menuItemRepository;
    }

    async getMenuByRestaurantId(restaurantId) {
        return await this.repository.findByRestaurantId(restaurantId);
    }
}
