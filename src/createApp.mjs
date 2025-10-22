import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import routes from "./routes/index.mjs";
import { logggingMiddleware } from "./utils/middlewares.mjs";
import "./strategies/local-strategy.mjs";
//import "./strategies/google-strategy.mjs";
import "dotenv/config";

function createApp() {
  const app = express();

  app.use(express.json());
  app.use(cookieParser(process.env.COOKIE_SECRET));
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      saveUninitialized: false,
      resave: false,
      cookie: {
        maxAge: 1000 * 60 * 60, // 1 hour
      },
      store: MongoStore.create({
        client: mongoose.connection.getClient(),
      }),
    })
  );
  app.use(logggingMiddleware);
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(routes);

  return app;
}

export default createApp;
