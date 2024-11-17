export class RestaurantController {
    constructor(restaurantService, menuItemService) {
        this.service = restaurantService;
        // TODO: Is it fine for the RestaurantController to know about the MenuItemService?
        this.menuItemService = menuItemService;
    }

    async getRestaurants(req, res, next) {
        try {
            const restaurants = await this.service.getAllRestaurants();
            res.json(restaurants);
        } catch (error) {
            // TODO: Create a middleware to handle errors
            next(error);
        }
    }

    async getRestaurant(req, res, next) {
        try {
            const restaurant = await this.service.getRestaurantById(req.params.id);

            console.log(restaurant);

            console.log("B")

            console.log(restaurant.toJSON());

            console.log("A")

            res.json(restaurant);
        } catch (error) {
            next(error);
        }
    }

    async createRestaurant(req, res, next) {
        try {

            // TODO: Remove the necessity of this transformation by changing the frontend
            req.body.menuItems = req.body.platos;
            delete req.body.platos;

            const restaurant = await this.service.createRestaurant(
                { ...req.body },
                { // TODO: Is it fine if the logo and images are null?
                    logo: req.files && req.files[0] ? req.files[0] : null,
                    images: req.files && req.files.length > 1 ? req.files.slice(1) : [],
                }
            );

            res.status(201).json({
                message: 'Restaurant created successfully',
                data: restaurant
            });
        } catch (error) {
            next(error);
        }
    }

    // TODO: Maybe this should be in a different controller...
    async getMenu(req, res, next) {
        try {
            const menuItems = await this.menuItemService.getMenuByRestaurantId(req.params.id);
            res.json(menuItems);
        } catch (error) {
            next(error);
        }
    }

}