export class RestaurantService {
    constructor (restaurantRepository) {
        this.repository = restaurantRepository;
    }

    async getAllRestaurants() {
        return await this.repository.findAll();
    }

    async getRestaurantById(id) {
        const restaurant = await this.repository.findById(id);
        if (!restaurant) {
            throw new Error('Restaurant not found');
        }
        return restaurant;
    }

    async createRestaurant(data, files) {
        this.validateRestaurantData(data);

        const restaurantData = {
            restaurant_name: data.nombre,
            description: data.descripcion,
            latitude: data.latitud,
            longitude: data.longitud,
            logo: files.logo?.buffer || null,
            image0: files.images[0]?.buffer || null,
            image1: files.images[1]?.buffer || null,
            image2: files.images[2]?.buffer || null,
            image3: files.images[3]?.buffer || null,
            image4: files.images[4]?.buffer || null
        };

        return await this.repository.create(restaurantData, data.menuItems);
    }

    validateRestaurantData(data) {
        if (!data.nombre || !data.descripcion || !data.latitud || !data.longitud) {
            throw new Error('Missing required restaurant fields');
        }

        if (!data.menuItems) {
            // TODO: Is it acceptable not to have menu items?
            return;
        }

        console.log(data.menuItems);

        if (!Array.isArray(data.menuItems)) {
            throw new Error('Menu items must be an array');
        }

        data.menuItems.forEach((item, index) => {
            if (!item.nombre || !item.precio) {
                throw new Error(`Missing required fields in menu item at index ${index}`);
            }
        });
    }

}