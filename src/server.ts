import app from './app';
import { SSLManager } from './ssl/ssl';
import * as http from 'http';
import * as https from 'https';

class Server {
	private httpPort: number;
	private httpsPort: number;

	constructor() {
		this.httpPort = parseInt(process.env.PORT || '3000');
		this.httpsPort = parseInt(process.env.HTTPS_PORT || '3443');
	}

	public start(): void {
		// Запуск HTTP сервера
		const httpServer = http.createServer(app);
		httpServer.listen(this.httpPort, () => {
			console.log(`HTTP Server running on port ${this.httpPort}`);
			console.log(`Health check: http://localhost:${this.httpPort}/health`);
		});

		// Запуск HTTPS сервера (если настроены SSL сертификаты)
		const httpsServer = SSLManager.createHTTPSServer(app);
		if (httpsServer) {
			httpsServer.listen(this.httpsPort, () => {
				console.log(`HTTPS Server running on port ${this.httpsPort}`);
				console.log(`Health check: https://localhost:${this.httpsPort}/health`);
			});
		} else {
			console.log('HTTPS server is disabled. Configure SSL certificates to enable.');
		}

		this.configureGracefulShutdown(httpServer, httpsServer);
	}

	private configureGracefulShutdown(httpServer: http.Server, httpsServer: https.Server | null): void {
		const gracefulShutdown = (signal: string) => {
			console.log(`Received ${signal}. Starting graceful shutdown...`);

			httpServer.close(() => {
				console.log('HTTP server closed');

				if (httpsServer) {
					httpsServer.close(() => {
						console.log('HTTPS server closed');
						process.exit(0);
					});
				} else {
					process.exit(0);
				}
			});

			// Force close after 10 seconds
			setTimeout(() => {
				console.error('Could not close servers in time, forcefully shutting down');
				process.exit(1);
			}, 10000);
		};

		process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
		process.on('SIGINT', () => gracefulShutdown('SIGINT'));
	}
}

// Запуск сервера
const server = new Server();
server.start();
