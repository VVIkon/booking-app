import knex, { Knex } from 'knex';
import config from './knexfile';

const environment = process.env.NODE_ENV === 'test' ? 'development' : process.env.NODE_ENV || 'development';

if (!config[environment]) {
	throw new Error('development config not found');
}

const knexConfig: Knex.Config = config[environment];
// console.log(`>>> knexConfig:`, knexConfig);

// Создание экземпляра Knex
const db: Knex = knex(knexConfig);

// Тестовое соединение
if (process.env.NODE_ENV !== 'test') {
	db.raw('SELECT 1')
		.then(() => {
			console.log('Database connected successfully');
		})
		.catch((error: Error) => {
			console.error('Database connection failed:', error.message);
			process.exit(1);
		});
}
// Обработка graceful shutdown
process.on('SIGINT', async () => {
	try {
		await db.destroy();
		console.log('Database connection closed');
		process.exit(0);
	} catch (error) {
		console.error('Error closing database connection:', error);
		process.exit(1);
	}
});

export default db;
