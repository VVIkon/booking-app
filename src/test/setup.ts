import { Knex } from 'knex';

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.DB_HOST = '192.168.1.104';
process.env.DB_PORT = '5432';
process.env.DB_NAME = 'anki_exam';
process.env.DB_USER = 'grass';
process.env.DB_PASSWORD = 'ladybug1';
// process.env.DB_HOST = 'localhost';
// process.env.DB_PORT = '5432';
// process.env.DB_NAME = 'booking_app_test';
// process.env.DB_USER = 'postgres';
// process.env.DB_PASSWORD = 'password';

// Global test timeout
jest.setTimeout(10000);

// Clean up after tests
afterAll(async () => {
  // Close any open connections
});
