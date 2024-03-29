import express from "express";
import dotenv from 'dotenv'
import authRoutes from './app/api/auth/routes.js'
import cors from 'cors';

// To read .env file
dotenv.config();

const app = express()

// Settings for sending data using http/https
app.use(express.urlencoded({ extended: false }))

app.use(express.json({ limit: '50mb' }));

app.use(cors());


// Add routes here
app.use(authRoutes)


// Error Handler Middleware
app.use((err, req, res, next) => {

  console.error(err.stack)

  res.status(500).json({ error: true, status: 500, message: err?.message })

})

app.listen(process.env.PORT, () => {
  console.log(`--------------------------------------`);

  console.log(` `);

  console.log(`ENVIRONMENT: ${process.env.NODE_ENV}`);

  console.log(`APPLICATION: ${process.env.APP_URL}`);

  console.log(` `);

  console.log(`--------------------------------------`);
});



