import {RestaurantRepository} from "../infrastructure/repositories/restaurantRepository.js";
import {RestaurantService} from "../domain/services/restaurantService.js";
import {RestaurantController} from "../controllers/restaurantController.js";
import {createRestaurantRouter} from "../routes/restaurantRoutes.js";

export function setupRestaurantModule(models, cacheService) {
    const repository = new RestaurantRepository(models, cacheService);
    const service = new RestaurantService(repository);
    const controller = new RestaurantController(service);
    const router = createRestaurantRouter(controller);

    return {
        repository,
        service,
        controller,
        router
    };
}
