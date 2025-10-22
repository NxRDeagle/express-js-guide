import mongoose from "mongoose";
import createApp from "./createApp.mjs";
import "dotenv/config";

mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("connected to db"))
  .catch((err) => console.log(`Error: ${err}`));

const app = createApp();

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
