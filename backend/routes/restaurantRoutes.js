import { Router } from 'express';
import multer from 'multer';

const upload = multer();

export function createRestaurantRouter(restaurantController) {
    const router = Router();

    router.get('/restaurante', restaurantController.getRestaurants.bind(restaurantController));
    router.get('/restaurante/:id', restaurantController.getRestaurant.bind(restaurantController));
    router.post(
        '/restaurante',
        upload.any(),
        restaurantController.createRestaurant.bind(restaurantController)
    );

    return router;
}
