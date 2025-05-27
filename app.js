import express from 'express';
import {PORT} from './config/env.js'
import userRouter from './routes/user.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';
import connectToDatabase from './database/mongodb.js';
import errorMiddleware from './middlewares/error.middleware.js';
import cookieParser from 'cookie-parser';
import arcjetMiddleware from './middlewares/arcjet.middleware.js';
import cors from 'cors'

const app = express();

const allowedOrigins = [
    'https://my-frontend-app.vercel.app',
    'http://localhost:5173'               
  ];
  
  // CORS options
  const corsOptions = {
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,  // if you want to send cookies/auth headers
  };
  
  app.use(cors(corsOptions));
  



app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(arcjetMiddleware);

app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);


app.use(errorMiddleware);

app.get('/', (req, res)=>{
    res.send("hello world");
});


app.listen(PORT, async()=>{
    console.log(`${PORT}`)
    await connectToDatabase();
})

export default app;