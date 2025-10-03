import * as fs from 'fs';
import * as https from 'https';
import { SSLManager, SSLConfig } from '../ssl';
import app from '../../app';

jest.mock('fs');
jest.mock('https');

describe('SSLManager', () => {
	const originalEnv = process.env;

	beforeEach(() => {
		jest.resetModules();
		process.env = { ...originalEnv };
		jest.clearAllMocks();
	});

	afterAll(() => {
		process.env = originalEnv;
	});

	describe('getSSLConfig', () => {
		it('should return SSL config when certificates exist', () => {
			process.env.SSL_KEY_PATH = './ssl/key.pem';
			process.env.SSL_CERT_PATH = './ssl/cert.pem';

			(fs.readFileSync as jest.Mock).mockReturnValueOnce('private-key').mockReturnValueOnce('certificate');

			(fs.existsSync as jest.Mock).mockReturnValue(false);

			const config = SSLManager.getSSLConfig();

			expect(config).toEqual({
				key: 'private-key',
				cert: 'certificate',
			});
		});

		it('should include CA bundle when provided', () => {
			process.env.SSL_KEY_PATH = './ssl/key.pem';
			process.env.SSL_CERT_PATH = './ssl/cert.pem';
			process.env.SSL_CA_PATH = './ssl/ca.pem';

			(fs.readFileSync as jest.Mock)
				.mockReturnValueOnce('private-key')
				.mockReturnValueOnce('certificate')
				.mockReturnValueOnce('ca-bundle');

			(fs.existsSync as jest.Mock).mockReturnValue(true);

			const config = SSLManager.getSSLConfig();

			expect(config).toEqual({
				key: 'private-key',
				cert: 'certificate',
				ca: 'ca-bundle',
			});
		});

		it('should return null when SSL paths not configured', () => {
			delete process.env.SSL_KEY_PATH;
			delete process.env.SSL_CERT_PATH;

			const config = SSLManager.getSSLConfig();

			expect(config).toBeNull();
		});
	});

	describe('createHTTPSServer', () => {
		it('should create HTTPS server when SSL config available', () => {
			const mockCreateServer = https.createServer as jest.Mock;
			const mockServer = { listen: jest.fn() };
			mockCreateServer.mockReturnValue(mockServer);

			process.env.SSL_KEY_PATH = './ssl/key.pem';
			process.env.SSL_CERT_PATH = './ssl/cert.pem';

			(fs.readFileSync as jest.Mock).mockReturnValueOnce('private-key').mockReturnValueOnce('certificate');

			const server = SSLManager.createHTTPSServer(app);

			expect(server).toBe(mockServer);
			expect(mockCreateServer).toHaveBeenCalledWith(
				{
					key: 'private-key',
					cert: 'certificate',
				},
				app,
			);
		});

		it('should return null when SSL config not available', () => {
			delete process.env.SSL_KEY_PATH;

			const server = SSLManager.createHTTPSServer(app);

			expect(server).toBeNull();
		});
	});
});
