export class webSocketOrderController {
    constructor(orderService) {
        this.service = orderService;
    }

    // async handleAddOrder(socket, io, orderData) {
    //     try {
    //         const createOrderDTO = new CreateOrderDTO(orderData);
    //         const order = await this.service.createOrder(createOrderDTO);
    //         io.emit('newOrder', order);
    //     } catch (error) {
    //         console.error('Error in handleAddOrder:', error);
    //         socket.emit('error', 'Failed to create order');
    //     }
    // }
    //
    // async handleFetchOrders(socket, restaurantId) {
    //     try {
    //         const orders = await this.service.getOrdersByRestaurant(restaurantId);
    //         socket.emit('ordersFetched', orders);
    //     } catch (error) {
    //         console.error('Error in handleFetchOrders:', error);
    //         socket.emit('error', 'Failed to fetch orders');
    //     }
    // }

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
}
