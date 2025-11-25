import dataSource from '../typeorm.config';

async function runMigrations() {
    try {
        await dataSource.initialize();
        console.log('DataSource initialized. Running migrations...');

        const migrations = await dataSource.runMigrations();
        console.log(`Executed ${migrations.length} migrations.`);

        await dataSource.destroy();
        console.log('Migrations finished. Connection closed.');
    } catch (err) {
        console.error('Error during migration run:', err);
        process.exit(1);
    }
}

runMigrations();
