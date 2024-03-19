import express from "express";
import dotenv from 'dotenv'
import cors from 'cors';
import { deleteSessions, errorHandler } from "./app/lib/middleware.js";
import mysql from './app/config/db.config.js'

// Routes
import authRoutes from './app/api/auth/routes.js'
import mediaRoutes from './app/api/media/routes.js'
import menuRoutes from './app/api/menu/routes.js'
import userRoutes from './app/api/user/routes.js'

// To read .env file
dotenv.config();

const app = express()

// Middlewares
app.use(express.urlencoded({ extended: false }))
app.use(express.json({ limit: '50mb' }));
app.use(cors());

app.use(deleteSessions) // Delete sessions every time there is an expired token

// Add routes here
app.use(authRoutes)
app.use(mediaRoutes)
app.use(menuRoutes)
app.use(userRoutes)

app.use(errorHandler)

app.listen(process.env.PORT, async () => {
  console.log(`--------------------------------------`);
  console.log(` `);
  console.log(`ENVIRONMENT: ${process.env.NODE_ENV}`);
  console.log(`APPLICATION: ${process.env.APP_URL}`);
  console.log(` `);
  console.log(`--------------------------------------`);
  console.log(` `);
  mysql
    .getConnection()
    .then((conn) => {
      const res = conn.query('SELECT 1');
      conn.release();
      return res;
    })
    .then((result) => {
      console.log('MySQL Database: Connected!');
      console.log(` `);
      console.log(`--------------------------------------`);
    })
    .catch((err) => {
      console.log(err); // any of connection time or query time errors from above
      console.log(` `);
      console.log(`--------------------------------------`);
    });
});