export class MenuItemController {
    constructor(menuItemService) {
        this.service = menuItemService;
    }

    async getMenu(req, res, next) {
        try {
            const menuItems = await this.service.getMenuByRestaurantId(req.params.id);
            res.json(menuItems);
        } catch (error) {
            next(error);
        }
    }
}
