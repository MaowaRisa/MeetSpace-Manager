import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import router from './app/routes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';

const app: Application = express();
// Parsers
app.use(express.json());
app.use(cors());

// Application routes
app.use('/api', router)

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to MeetSpace Manager Application.');
});
app.use(globalErrorHandler);
export default app;
