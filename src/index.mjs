import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import routes from "./routes/index.mjs";
import { logggingMiddleware } from "./utils/middlewares.mjs";
import "dotenv/config";
// import "./strategies/local-strategy.mjs";
import "./strategies/google-strategy.mjs";

const app = express();

mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("connected to db"))
  .catch((err) => console.log(`Error: ${err}`));

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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Running on ${PORT}`);
});

app.get("/", (request, response) => {
  console.log(request.session);
  console.log(request.session.id);
  request.session.visited = true;
  response.cookie("hello", "world", { maxAge: 30000, signed: true });
  response.status(201).send("hello");
});
