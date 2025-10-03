import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes';
import { ErrorResponse, HealthResponse } from './types';
import * as dotenv from 'dotenv';

dotenv.config();

class App {
	public app: Express;

	constructor() {
		this.app = express();
		this.configureMiddleware();
		this.configureRoutes();
		this.configureErrorHandling();
	}

	private configureMiddleware(): void {
		// Security middleware
		this.app.use(helmet());

		// CORS configuration
		this.app.use(
			cors({
				origin: process.env.CORS_ORIGIN || '*',
				methods: ['GET', 'POST', 'PUT', 'DELETE'],
				allowedHeaders: ['Content-Type', 'Authorization'],
			}),
		);

		// Body parsing middleware
		this.app.use(express.json({ limit: '10mb' }));
		this.app.use(express.urlencoded({ extended: true }));
	}

	private configureRoutes(): void {
		// Health check
		this.app.get(
			'/health',
			(req: Request, res: Response<HealthResponse>) => {
				res.json({
					status: 'OK',
					timestamp: new Date().toISOString(),
					environment: process.env.NODE_ENV || 'development',
				});
			},
		);

		// API routes
		this.app.use('/api', routes);

		// 404 handler
		this.app.use('*', (req: Request, res: Response<ErrorResponse>) => {
			res.status(404).json({
				error: 'Маршрут не найден',
			});
		});
	}

	private configureErrorHandling(): void {
		// Global error handler
		this.app.use(
			(
				error: Error,
				req: Request,
				res: Response<ErrorResponse>,
				next: NextFunction,
			) => {
				console.error('Необработанная ошибка:', error);

				res.status(500).json({
					error: 'Внутренняя ошибка сервера',
					details:
						process.env.NODE_ENV === 'development'
							? error.message
							: undefined,
				});
			},
		);
	}
}

export default new App().app;
