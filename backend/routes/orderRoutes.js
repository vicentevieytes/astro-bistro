import { Router } from "express";

export function createOrderRouter(orderController) {
    const router = Router();

    router.get("/restaurantes/:id/comandas", orderController.getOrders.bind(orderController));

    return router;
}
