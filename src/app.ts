import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import router from './app/routes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';

const app: Application = express();
// Parsers
app.use(express.json());
app.use(cors());

// Application routes
app.use('/api', router);

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to MeetSpace Manager Application.');
});
// Error handling middleware
app.use(globalErrorHandler);
// Not found
app.use(notFound);
export default app;
