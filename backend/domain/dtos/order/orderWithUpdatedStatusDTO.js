export class OrderWithUpdatedStatusDTO {
    constructor(orderId, newStatusName) {
        this.orderId = orderId;
        this.newStatus = newStatusName;
    }
}
