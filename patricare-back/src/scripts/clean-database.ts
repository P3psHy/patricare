import { Client } from 'pg';
import { databaseConfig } from '../config/database.config';

async function cleanDatabase() {
    const { host, port, username, password, database } = databaseConfig;

    const client = new Client({
        host,
        port,
        user: username,
        password,
        database,
    });

    try {
        await client.connect();

        // Drop all tables
        await client.query(`
            DROP SCHEMA public CASCADE;
            CREATE SCHEMA public;
            GRANT ALL ON SCHEMA public TO postgres;
            GRANT ALL ON SCHEMA public TO public;
        `);

        console.log('Database cleaned successfully.');
    } catch (err) {
        console.error('Error cleaning database:', err);
        process.exit(1);
    } finally {
        await client.end();
    }
}

cleanDatabase().catch((err) => {
    console.error(err);
    process.exit(1);
});
