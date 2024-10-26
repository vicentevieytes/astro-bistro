import pgk from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new pgk.Pool();

async function get(databaseTable, id) {
    const client = await pool.connect();
    try {
        const result = await client.query(`SELECT * FROM "${databaseTable}" WHERE id = $1`, [id]);
        return result.rows[0];
    } finally {
        client.release();
    }
}

async function getAll(databaseTable) {
    const client = await pool.connect();
    try {
        const result = await client.query(`SELECT * FROM ${databaseTable}`);
        return result.rows;
    } finally {
        client.release();
    }
}

async function create(databaseTable, data) {
    const client = await pool.connect();
    try {
        const columns = Object.keys(data).map(v => `"${v}"`);
        const values = Object.values(data);
        const placeholders = columns.map((_, i) => `$${i + 1}`).join(", ");
        const result = await client.query(`INSERT INTO ${databaseTable} (${columns.join(',')}) VALUES (${placeholders}) RETURNING *`, values);
        return result.rows[0];
    } finally {
        client.release();
    }
}

//create("menu", { name: "Burger", price: 10, description: "A delicious burger", restaurante_id: 1 }).then(console.log).finally(() => pool.end());
getAll("menu").then(console.log).finally(() => pool.end());

