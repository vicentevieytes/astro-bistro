import { MenuItemRepository } from "../infrastructure/repositories/menuItemRepository.js";
import { MenuItemService } from "../domain/services/menuItemService.js";
import { MenuItemController } from "../controllers/menuItemController.js";
import { createMenuItemRouter } from "../routes/menuItemRoutes.js";

export function setupMenuItemModule(models) {
    const menuItemRepository = new MenuItemRepository(models);
    const menuItemService = new MenuItemService(menuItemRepository);
    const menuItemController = new MenuItemController(menuItemService);
    const menuItemRouter = createMenuItemRouter(menuItemController);

    return {
        repository: menuItemRepository,
        service: menuItemService,
        controller: menuItemController,
        router: menuItemRouter,
    };
}
