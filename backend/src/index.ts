import express, { Express, Request, Response, NextFunction } from 'express';
import { Pool, PoolClient } from 'pg';

interface ApiResponse {
	message: string;
	time?: string | Date;
	error?: string;
	details?: string;
}

const app: Express = express();

// CORS 有効化˚ø
app.use((req: Request, res: Response, next: NextFunction) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	if (req.method === 'OPTIONS') {
		res.sendStatus(200);
	} else {
		next();
	}
});

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
});

app.get('/api/hello', async (req: Request, res: Response) => {
	try {
		const result = await pool.query('SELECT NOW()');
		const response: ApiResponse = {
			message: 'Hello from backend! TypeScript!',
			time: result.rows[0].now,
		};
		res.json(response);
	} catch (err) {
		console.error('Database error:', err);
		const errorResponse: ApiResponse = {
			message: 'Error',
			error: 'Internal Server Error',
			details: err instanceof Error ? err.message : 'Unknown error',
		};
		res.status(500).json(errorResponse);
	}
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Backend running on http://0.0.0.0:${PORT}`);
	console.log('Hot reload is enabled with nodemon');
});
