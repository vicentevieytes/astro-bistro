import { Router } from "express";

export function createMenuItemRouter(menuItemController) {
    const router = Router();

    router.get("/restaurantes/:id/menu", menuItemController.getMenu.bind(menuItemController));

    return router;
}
