import { db, Restaurante } from 'astro:db';

export default async function () {
    await db.insert(Restaurante).values([
        {
            name: 'Café Universitario',
            coords: [-34.5425, -58.437].toString(),
            description: 'Un lugar tranquilo para estudiar, con una excelente variedad de café y snacks.',
        },
        {
            name: 'Kiosko Al Paso',
            coords: [-34.5405, -58.4385].toString(),
            description: 'Kiosko ideal para comprar cosas rápidas entre clases. Tienen de todo.',
        },
        {
            name: 'Librería Universitaria',
            coords: [-34.543, -58.4368].toString(),
            description: 'Librería especializada en textos académicos y materiales de estudio.',
        },
        {
            name: 'Comida Rápida Gourmet',
            coords: [-34.5427, -58.4362].toString(),
            description: 'Deliciosos platos de comida rápida, ideales para llevar entre clases.',
        },
        {
            name: 'Heladería Fresca',
            coords: [-34.5434, -58.438].toString(),
            description: 'Helados artesanales para disfrutar en un día caluroso.',
        },
        {
            name: 'Pizzería Universitaria',
            coords: [-34.5408, -58.4374].toString(),
            description: 'Pizzas al paso con los mejores ingredientes.',
        },
        {
            name: 'Panadería El Estudiante',
            coords: [-34.542, -58.4358].toString(),
            description: 'Pan recién horneado y pasteles ideales para el desayuno.',
        },
        {
            name: 'Cafetería Aroma',
            coords: [-34.5435, -58.4365].toString(),
            description: 'Cafés especiales y un ambiente acogedor para estudiar.',
        },
    ]);
}
