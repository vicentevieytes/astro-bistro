import {CreateOrderDTO} from "../domain/dtos/order/createOrderDTO.js";

export class webSocketOrderController {
    constructor(orderService) {
        this.service = orderService;
    }

    // TODO: Decide if we need socket.emit or io.emit...

    async updateOrderStatus(socket, io, { orderId, newStatusId }) {
        try {
            const updatedOrder = await this.service.updateOrderStatus(orderId, newStatusId);
            console.log('updatedOrder:', updatedOrder);
            io.emit('orderStatusUpdated', updatedOrder);
        } catch (error) {
            console.error('Error in handleUpdateOrderStatus:', error);
            // socket.emit('error', 'Failed to update order status');
        }
    }

    // TODO: Change everything that says "Cart" to "Orders"
    async fetchCart(socket, userId) {
        try {
            const cart = await this.service.getOrdersByUsedId(userId);
            // Let's send the json:
            console.log("BEFORE:", cart);
            // const cartJson = JSON.stringify(cart);
            // console.log('cart:', cartJson);
            console.log("EPA")

            socket.emit('cartFetched', cart);

        } catch (error) {
            console.error('Error in handleFetchCart:', error);
            // socket.emit('error', 'Failed to fetch cart');
        }
    }

    async addToCart(socket, io, items) {
        try {
            if (!Array.isArray(items) || items.length === 0) {
                throw new Error('Invalid or empty items list');
            }

            const createOrderDTO = new CreateOrderDTO({
                userId: items[0].userId,
                restaurantId: items[0].restaurantId,
                items: items
            });

            const updatedCart = await this.service.createOrder(createOrderDTO);

            console.log('updatedCart:', updatedCart);

            io.emit('cartUpdated', updatedCart);
        } catch (error) {
            console.error('Error in addToCart:', error);
            socket.emit('error', 'Failed to add items to cart');
        }
    }

}
