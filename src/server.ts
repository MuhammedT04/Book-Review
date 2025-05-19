import express, { Express } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
 import router from './routes/authRouter'
import cookieParser from "cookie-parser";
import bookRouder from './routes/bookRouter';
import ReviewRouder from './routes/reviewRouter';

dotenv.config();

// Initialize Express app
const app: Express = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.use('/auth', router);
app.use('/books', bookRouder);
app.use('/reviews', ReviewRouder);



// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;