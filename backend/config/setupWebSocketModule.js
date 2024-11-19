import {OrderRepository} from "../infrastructure/repositories/orderRepository.js";
import {OrderService} from "../domain/services/orderService.js";
import {webSocketOrderController} from "../controllers/webSocketOrderController.js";


export function setupWebSocketModule(models) {
    const orderRepository = new OrderRepository(models);
    const orderService = new OrderService(orderRepository);
    const webSocketController = new webSocketOrderController(orderService);

    return {
        controller: webSocketController
    };
}

