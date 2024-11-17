import {MenuItem} from "./MenuItem.js";

export class Restaurant {
    constructor({
                    restaurant_id,
                    restaurant_name,
                    description,
                    latitude,
                    longitude,
                    logo,
                    image0,
                    image1,
                    image2,
                    image3,
                    image4,
                    MenuItems = []
                }) {
        this.id = restaurant_id;
        this.name = restaurant_name;
        this.description = description;
        this.latitude = latitude;
        this.longitude = longitude;
        this.logo = logo;
        this.images = [image0, image1, image2, image3, image4].filter(img => img);
        this.menuItems = MenuItems.map(item => new MenuItem(item));
    }

    toJSON() {
        return {
            restaurant_id: this.id,
            restaurant_name: this.name,
            description: this.description,
            latitude: this.latitude,
            longitude: this.longitude,
            logo: this.logo,
            image0: this.images[0] || null,
            image1: this.images[1] || null,
            image2: this.images[2] || null,
            image3: this.images[3] || null,
            image4: this.images[4] || null,
            menuItems: this.menuItems.map(item => item.toJSON())
        };
    }
}
