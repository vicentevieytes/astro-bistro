import { OrderRepository } from "../infrastructure/repositories/orderRepository.js";
import { OrderService } from "../domain/services/orderService.js";
import { OrderController } from "../controllers/orderController.js";
import { createOrderRouter } from "../routes/orderRoutes.js";

export function setupOrderModule(models) {
    const orderRepository = new OrderRepository(models);
    const orderService = new OrderService(orderRepository);
    const orderController = new OrderController(orderService);
    const orderRouter = createOrderRouter(orderController);

    return {
        repository: orderRepository,
        service: orderService,
        controller: orderController,
        router: orderRouter,
    };
}
