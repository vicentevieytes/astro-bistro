// // TODO: THINK OF A BETTER NAME
// export class OrderItemDTO {
//     constructor(data, restaurant) {
//         this.orderItemId = data.order_item_id;
//         this.orderId = data.order_id;
//         this.itemId = data.item_id;
//         this.name = data.MenuItem?.name;
//         this.quantity = data.quantity;
//         this.price = data.price;
//         this.restaurantId = restaurant?.restaurant_id;
//         this.restaurantName = restaurant?.restaurant_name;
//     }
// }

export class OrderItemDTO {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.price = data.price;
        this.quantity = data.quantity;
        this.status = data.status;
        this.restaurantId = data.restaurantId;
        this.restaurantName = data.restaurantName;
    }

    // toJSON() {
    //     console.log("BEING CALLED")
    //     return {
    //         id: this.id,
    //         name: this.name,
    //         price: this.price,
    //         quantity: this.quantity,
    //         status: this.status,
    //         restaurantId: this.restaurantId,
    //         restaurantName: this.restaurantName
    //     };
    // }
}