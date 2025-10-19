import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import mongoose from "mongoose";
import routes from "./routes/index.mjs";
import { logggingMiddleware } from "./utils/middlewares.mjs";
import "./strategies/local-strategy.mjs";

const app = express();

mongoose
  .connect("mongodb://localhost/express-js-guide")
  .then(() => console.log("connected to db"))
  .catch((err) => console.log(`Error: ${err}`));

app.use(express.json());
app.use(cookieParser("COOKIE_SECRET"));
app.use(
  session({
    secret: "SESSION_SECRET",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 60, // 1 hour
    },
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
