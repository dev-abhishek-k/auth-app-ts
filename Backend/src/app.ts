import express from 'express';
import authRoute from './routes/auth.routes';
import { ApiError } from './utils/api-error';
const app = express();
app.use(express.json());
app.use("/api/auth", authRoute);
app.all("{*path}", (req, res) => {
  throw ApiError.notFound(`Route ${req.originalUrl} not found`);
});

export default app;