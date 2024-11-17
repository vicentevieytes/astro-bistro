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
    router.get('/restaurantes/:id/menu', restaurantController.getMenu.bind(restaurantController));

    return router;
}
