import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import session from 'express-session';
import TodoRoutes from './routes/TodosRoutes.js';
import ErrorHandler from './middlewares/ErrorHandlers.js';
import connectDB from './config/Database.js';
import router from './routes/AuthRoutes.js';
import UserRouter from './routes/UserRoutes.js';



const app = express();
connectDB();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(session({
  secret: 'your_secret_key',
  resave: true,
  saveUninitialized: true,
}));

app.use('/', [router, TodoRoutes]);
app.use(ErrorHandler);
app.use('/', UserRouter);

// Start the server
const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log('Server is running:',port);
});
