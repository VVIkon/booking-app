import { Knex } from 'knex';

// Mock Knex instance
export const mockKnex = {
	select: jest.fn().mockReturnThis(),
	where: jest.fn().mockReturnThis(),
	first: jest.fn().mockReturnThis(),
	insert: jest.fn().mockReturnThis(),
	returning: jest.fn().mockReturnThis(),
	count: jest.fn().mockReturnThis(),
	join: jest.fn().mockReturnThis(),
	del: jest.fn().mockReturnThis(),
	destroy: jest.fn().mockResolvedValue(undefined),
	raw: jest.fn().mockResolvedValue({ rows: [] }),
};

// Mock the database module
jest.mock('../../db/database', () => mockKnex);
// jest.mock('../../config/database', () => mockKnex);
