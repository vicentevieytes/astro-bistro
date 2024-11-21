import {RestaurantRepository} from "../infrastructure/repositories/restaurantRepository.js";
import {RestaurantService} from "../domain/services/restaurantService.js";
import {RestaurantController} from "../controllers/restaurantController.js";
import {createRestaurantRouter} from "../routes/restaurantRoutes.js";

export function setupRestaurantModule(models, cacheService) {
    const restaurantRepository = new RestaurantRepository(models, cacheService);
    const restaurantService = new RestaurantService(restaurantRepository);
    const restaurantController = new RestaurantController(restaurantService);
    const restaurantRouter = createRestaurantRouter(restaurantController);

    return {
        repository: restaurantRepository,
        service: restaurantService,
        controller: restaurantController,
        router: restaurantRouter,
    };
}

