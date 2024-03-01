import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import config from './config/config.js';
const { serverPort } = config;

import authRouter from './routes/auth.router.js';
import userRouter from './routes/user.router.js';
import taskRouter from './routes/task.router.js';

const app = express();

// Setting HTTP response headers
app.use(helmet());

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cors
app.use(
	cors({
		origin: '*',
		allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
		preflightContinue: false,
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
	})
);

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/tasks', taskRouter);

app.listen(serverPort);
