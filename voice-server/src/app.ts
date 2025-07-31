import express from 'express';
import morgan from 'morgan';
import userRoutes from './routes/UserRoute';

export function createApp() {
  const app = express();
  
  app.use(morgan('dev'));
  app.use(express.json());
  
  // Routes
  app.use("/user", userRoutes);
  
  return app;
}