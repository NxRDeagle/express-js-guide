import { Router } from "express";
import { mockProducts } from "../utils/constants.mjs";

const router = Router();

router.get("/api/products", (request, response) => {
  console.log(request.headers.cookie);
  console.log(request.cookies);
  const cookie = request.signedCookies.hello;
  console.log(cookie);
  if (cookie && cookie === "world") return response.send(mockProducts);
  return response.status(403).send("Sorry, you need the correct cookies.");
});

export default router;
