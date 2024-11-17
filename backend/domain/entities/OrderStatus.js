export class OrderStatus {
    constructor({ status_id, status_name }) {
        this.id = status_id;
        this.statusName = status_name;
    }

    toJSON() {
        return {
            id: this.id,
            statusName: this.statusName
        };
    }
}
