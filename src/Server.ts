import express, {Request, Response} from 'express';

import BaseRouter from './routes';
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from './swagger.json';


// Init express
const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', '*');
  next();
});

// Registering base API routes
app.use('/api', BaseRouter);

// Registering API routes for swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// Catch API errors throughout the application
interface IError extends Error {
  status?: number;
}

app.use((req: Request, res: Response, next) => {
  const err: IError = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err: IError, req: Request, res: Response) => {
  console.log(err);
  if (err.status === 404) {
    res.status(404).json({ message: 'Not found' });
  } else {
    res.status(500).json({ message: 'Something is wrong' });
  }
});

export default app;
