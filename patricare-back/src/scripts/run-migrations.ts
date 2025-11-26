import 'dotenv/config';
import dataSource from '../typeorm.config';

async function runMigrations() {
  try {
    // Petit log de debug si tu veux vérifier la config utilisée
    // (tu peux le retirer une fois que tout marche)
    console.log('DataSource config:', {
      type: (dataSource.options as any).type,
      host: (dataSource.options as any).host,
      port: (dataSource.options as any).port,
      username: (dataSource.options as any).username,
      database: (dataSource.options as any).database,
    });

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

runMigrations().catch((err) => {
  console.error('Fatal error during migration run:', err);
  process.exit(1);
});
