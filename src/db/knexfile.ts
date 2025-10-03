import { Knex } from 'knex';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

interface KnexConfig {
	[key: string]: Knex.Config;
}

const config: KnexConfig = {
	development: {
		client: 'postgresql',
		connection: {
			host: process.env.DB_HOST || 'localhost',
			port: parseInt(process.env.DB_PORT || '5432'),
			database: process.env.DB_NAME || 'booking_app',
			user: process.env.DB_USER || 'postgres',
			password: process.env.DB_PASSWORD || 'password',
			ssl:
				process.env.NODE_ENV === 'production'
					? { rejectUnauthorized: false }
					: false,
		},
		pool: {
			min: 2,
			max: 10,
		},
		migrations: {
			directory: './migrations',
			tableName: 'knex_migrations',
		},
		seeds: {
			directory: './seeds',
		},
	},

	production: {
		client: 'postgresql',
		connection: {
			host: process.env.DB_HOST,
			port: parseInt(process.env.DB_PORT || '5432'),
			database: process.env.DB_NAME,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			ssl: { rejectUnauthorized: false },
		},
		pool: {
			min: 2,
			max: 20,
		},
		migrations: {
			directory: './migrations',
			tableName: 'knex_migrations',
		},
		seeds: {
			directory: './seeds',
		},
	},
};
export default config;
