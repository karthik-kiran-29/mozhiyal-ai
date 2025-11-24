import express from 'express';
import morgan from 'morgan';
import waitlistRoutes from './routes/WaitListRoute';
import cors from 'cors'

export function createApp() {
  const app = express();

  const corsOptions = {
  origin: process.env.FRONTEND_URL,
};

  app.use(cors(corsOptions));
  
  app.use(morgan('dev'));
  app.use(express.json());
  
  // Routes
  app.use("/waitlist", waitlistRoutes);
  
  return app;
}