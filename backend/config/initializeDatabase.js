import path from "node:path";
import fs from "node:fs";

export async function initializeDatabase(models) {
    try {
        await initializeOrderStatuses(models);
        await initializeFirstUser(models);
        await initializeInitialRestaurant(models);
    } catch (error) {
        console.error('Error initializing database:', error);
    }
}

async function initializeOrderStatuses(models) {
    const existingStatuses = await models.OrderStatus.count();

    if (existingStatuses === 0) { // Insert only if no statuses exist
        const statusesToInsert = [
            { status_id: 1, status_name: 'Aguardando aceptación' },
            { status_id: 2, status_name: 'Aceptado' },
            { status_id: 3, status_name: 'Rechazado' },
            { status_id: 4, status_name: 'En preparación' },
            { status_id: 5, status_name: 'Listo para ser retirado' },
            { status_id: 6, status_name: 'Pronto a ser servido' },
        ];
        await models.OrderStatus.bulkCreate(statusesToInsert);
        console.log('Order statuses inserted successfully.');
    } else {
        console.log('Order statuses already exist. Skipping insertion.');
    }
}

async function initializeFirstUser(models) {
    const firstUser = await models.User.findByPk(1);

    if (!firstUser) {
        await models.User.create({ user_id: 1, username: 'Pepe' });
        console.log('User "Pepe" created.');
    } else {
        console.log('User with ID 1 already exists.');
    }
}

async function initializeInitialRestaurant(models) {
    const existingRestaurants = await models.Restaurant.count();

    if (existingRestaurants === 0) {
        const restaurantData = await createInitialRestaurantData();
        await models.Restaurant.create(restaurantData);

        const menuItemsToInsert = [
            { restaurant_id: 1, name: 'Café con leche', description: 'Café tradicional argentino con leche', price: 8.00 },
            { restaurant_id: 1, name: 'Medialunas', description: 'Medialunas dulces argentinas', price: 3.50 },
            { restaurant_id: 1, name: 'Tostado', description: 'Sándwich de jamón y queso tostado', price: 10.00 },
            { restaurant_id: 1, name: 'Jugo de naranja', description: 'Jugo de naranja exprimido', price: 6.00 },
            { restaurant_id: 1, name: 'Factura', description: 'Factura dulce', price: 4.00 },
        ];

        await models.MenuItem.bulkCreate(menuItemsToInsert);
        console.log('Initial menu items inserted successfully.');
    } else {
        console.log('Restaurants already exist. Skipping insertion.');
    }
}

async function createInitialRestaurantData(models) {
    const logoPath = path.join('initial_restaurants', 'cafeteria_pepe_logo.jpg');
    const mainImagePath = path.join('initial_restaurants', 'cafeteria_pepe_imagen_1.png');
    const secundaryImagePath = path.join('initial_restaurants', 'cafeteria_pepe_imagen_2.png');

    const logoData = fs.readFileSync(logoPath);
    const mainImageData = fs.readFileSync(mainImagePath);
    const secundaryImageData = fs.readFileSync(secundaryImagePath);

    return {
        restaurant_name: 'Cafetería de Pepe',
        description: 'Buen café a buen precio',
        latitude: -34.53682788,
        longitude: -58.44516277,
        logo: logoData,
        image0: mainImageData,
        image1: secundaryImageData,
        image2: mainImageData,
        image3: secundaryImageData,
        image4: mainImageData,
    };
}