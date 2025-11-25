import 'dotenv/config';
import { Client } from 'pg';
import { databaseConfig } from '../config/database.config';

async function createDatabase() {
  const { host, port, username, password, database } = databaseConfig;

  // Toujours se connecter à la base système "postgres"
  const client = new Client({
    host,
    port,
    user: username,
    password,
    database: 'postgres',
  });

  try {
    await client.connect();

    // Vérifier si la DB existe
    const checkDb = await client.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [database],
    );

    if (checkDb.rowCount === 0) {
      const safeDbName = database.replace(/"/g, '""');
      await client.query(`CREATE DATABASE "${safeDbName}"`);
      console.log(`✔ Database "${database}" created.`);
    } else {
      console.log(`✔ Database "${database}" already exists.`);
    }
  } catch (err) {
    console.error('❌ Error creating database:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

createDatabase().catch((err) => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
