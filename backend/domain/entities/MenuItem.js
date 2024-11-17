export class MenuItem {
    constructor({ item_id, restaurant_id, name, description, price }) {
        this.id = item_id;
        this.restaurantId = restaurant_id;
        this.name = name;
        this.description = description;
        this.price = price;
    }

    toJSON() {
        return {
            item_id: this.id,
            restaurant_id: this.restaurantId,
            name: this.name,
            description: this.description,
            price: this.price
        };
    }
}
