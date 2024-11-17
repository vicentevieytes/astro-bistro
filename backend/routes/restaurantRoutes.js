import { Router } from 'express';
import multer from 'multer';

const upload = multer();

export function createRestaurantRouter(restaurantController) {
    const router = Router();

    router.get('/restaurantes', restaurantController.getRestaurants.bind(restaurantController));
    router.get('/restaurantes/:id', restaurantController.getRestaurant.bind(restaurantController));
    router.post(
        '/restaurantes',
        upload.any(),
        restaurantController.createRestaurant.bind(restaurantController)
    );

    // TODO: Move this to a menuItemController? I think so because we can get the menu items with just the restaurant id...
    router.get('/restaurantes/:id/menu', restaurantController.getMenu.bind(restaurantController));

    // TODO: Move this to a comandaController? Or maybe it is coupled with Restaurant...
    router.get('/restaurantes/:id/comandas', restaurantController.getOrders.bind(restaurantController));

    return router;
}
