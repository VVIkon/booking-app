import * as fs from 'fs';
import { Express } from 'express';
import * as path from 'path';
import * as https from 'https';
import { IncomingMessage, ServerResponse } from 'http';

export interface SSLConfig {
	key: Buffer;
	cert: Buffer;
	ca?: Buffer;
}

interface RequestListener {
	(req: IncomingMessage, res: ServerResponse): void;
}

export class SSLManager {
	static getSSLConfig(): SSLConfig | null {
		const keyPath = process.env.SSL_KEY_PATH;
		const certPath = process.env.SSL_CERT_PATH;
		const caPath = process.env.SSL_CA_PATH;

		if (!keyPath || !certPath) {
			console.warn('SSL paths not configured. HTTPS will be disabled.');
			return null;
		}

		try {
			const sslConfig: SSLConfig = {
				key: fs.readFileSync(path.resolve(keyPath)),
				cert: fs.readFileSync(path.resolve(certPath)),
			};

			if (caPath && fs.existsSync(path.resolve(caPath))) {
				sslConfig.ca = fs.readFileSync(path.resolve(caPath));
			}

			return sslConfig;
		} catch (error) {
			console.error('Error loading SSL certificates:', error);
			return null;
		}
	}

	static createHTTPSServer(app: Express): https.Server | null {
		const sslConfig = this.getSSLConfig();

		if (!sslConfig) {
			return null;
		}

		const httpsOptions: https.ServerOptions = {
			key: sslConfig.key,
			cert: sslConfig.cert,
		};

		if (sslConfig.ca) {
			httpsOptions.ca = sslConfig.ca;
		}

		// Приведение к кастомному типу
		const requestListener: RequestListener = (req, res) => {
			app(req, res);
		};

		return https.createServer(httpsOptions, requestListener);
	}
}
