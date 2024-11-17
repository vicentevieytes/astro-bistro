import {RestaurantRepository} from "../infrastructure/repositories/restaurantRepository.js";
import {RestaurantService} from "../domain/services/restaurantService.js";
import {RestaurantController} from "../controllers/restaurantController.js";
import {createRestaurantRouter} from "../routes/restaurantRoutes.js";
import {MenuItemRepository} from "../infrastructure/repositories/menuItemRepository.js";
import {MenuItemService} from "../domain/services/menuItemService.js";
import {OrderRepository} from "../infrastructure/repositories/orderRepository.js";
import {OrderService} from "../domain/services/orderService.js";

export function setupRestaurantModule(models, cacheService) {
    const repository = new RestaurantRepository(models, cacheService);
    const restaurantService = new RestaurantService(repository);
    // TODO: Warning: Coupling detected!
    const menuItemRepository = new MenuItemRepository(models);
    const menuItemService = new MenuItemService(menuItemRepository);
    // TODO: Is it a good idea for the RestaurantController to depend on the MenuItemRepository?

    const orderRepository = new OrderRepository(models);
    const orderService = new OrderService(orderRepository);

    const controller = new RestaurantController(restaurantService, menuItemService, orderService);
    const router = createRestaurantRouter(controller);

    return {
        repository,
        service: restaurantService,
        controller,
        router
    };
}
