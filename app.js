import express from "express";
import dotenv from 'dotenv'
import cors from 'cors';
import { deleteSessions, errorHandler } from "./app/lib/middleware.js";
import mysql from './app/config/db.config.js'

// Routes
import announcementsRoutes from './app/api/announcements/routes.js'
import announcementsCustomRoutes from './app/api/announcements_custom/routes.js'
import announcementsPerDbRoutes from './app/api/announcements_per_db/routes.js'
import authRoutes from './app/api/auth/routes.js'
import cvLibraryBusinessUnitRoutes from './app/api/cv_library_business_unit/routes.js'
import cvLibraryCategoryRoutes from './app/api/cv_library_category/routes.js'
import cvLibraryExternalRoutes from './app/api/cv_library_external/routes.js'
import cvLibraryHiringSourceRoutes from './app/api/cv_library_hiring_source/routes.js'
import cvLibraryModuleRoutes from './app/api/cv_library_module/routes.js'
import cvLibraryPrincipalRoutes from './app/api/cv_library_principal/routes.js'
import cvLibraryProductRoutes from './app/api/cv_library_product/routes.js'
import cvLibrarySubProductRoutes from './app/api/cv_library_sub_product/routes.js'
import dtrRoutes from './app/api/dtr/routes.js'
import leaveRoutes from './app/api/leave/routes.js'
import locationLogsRoutes from './app/api/location_logs/routes.js'
import mediaRoutes from './app/api/media/routes.js'
import menuRoutes from './app/api/menu/routes.js'
import menuPerUserRoutes from './app/api/menu_per_user/routes.js'
import menuPerRoleRoutes from './app/api/menu_per_role/routes.js'
import overtimeRoutes from './app/api/overtime/routes.js'
import ticketRoutes from './app/api/ticket/routes.js'
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
app.use(announcementsRoutes)
app.use(announcementsCustomRoutes)
app.use(announcementsPerDbRoutes)
app.use(authRoutes)
app.use(cvLibraryBusinessUnitRoutes)
app.use(cvLibraryCategoryRoutes)
app.use(cvLibraryExternalRoutes)
app.use(cvLibraryHiringSourceRoutes)
app.use(cvLibraryModuleRoutes)
app.use(cvLibraryPrincipalRoutes)
app.use(cvLibraryProductRoutes)
app.use(cvLibrarySubProductRoutes)
app.use(dtrRoutes)
app.use(leaveRoutes)
app.use(locationLogsRoutes)
app.use(mediaRoutes)
app.use(menuRoutes)
app.use(menuPerUserRoutes)
app.use(menuPerRoleRoutes)
app.use(overtimeRoutes)
app.use(ticketRoutes)
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