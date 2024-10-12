import { defineDb, defineTable, column } from 'astro:db';

const Restaurante = defineTable({
    columns: {
        id: column.number({ primaryKey: true }),
        name: column.text(),
        coords: column.text(),
        description: column.text(),
    },
});

// https://astro.build/db/config
export default defineDb({
    tables: { Restaurante },
});
