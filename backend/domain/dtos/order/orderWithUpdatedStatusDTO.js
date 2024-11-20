export class OrderWithUpdatedStatusDTO {
    constructor(order_id, status_name) {
        this.orderId = order_id;
        this.newStatus = status_name;
    }
}
