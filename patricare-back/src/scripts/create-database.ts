import { Client } from 'pg';
import { databaseConfig } from '../config/database.config';

async function createDatabase() {
    const { host, port, username, password, database } = databaseConfig;
    const adminDb = 'postgres';

    const client = new Client({
        host,
        port,
        user: username,
        password,
        database: adminDb,
    });

    try {
        await client.connect();

        const res = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [database]);

        if (res.rowCount === 0) {
            const safeDb = database.replace(/"/g, '""');
            await client.query(`CREATE DATABASE "${safeDb}"`);
            console.log(`Database "${database}" created.`);
        } else {
            console.log(`Database "${database}" already exists.`);
        }
    } catch (err) {
        console.error('Error creating database:', err);
        process.exit(1);
    } finally {
        await client.end();
    }
}

createDatabase().catch((err) => {
    console.error(err);
    process.exit(1);
});
