import { Router } from "express";
import passport from "passport";

const router = Router();

// router.post(
//   "/api/auth",
//   passport.authenticate("local"),
//   (request, response) => {
//     response.sendStatus(200);
//   }
// );

router.get("/api/auth/status", (request, response) => {
  return request.user ? response.send(request.user) : response.sendStatus(401);
});

router.post("/api/auth/logout", (request, response) => {
  if (!request.user) return response.sendStatus(401);
  request.logout((err) => {
    if (err) return response.sendStatus(400);
    response.send(200);
  });
});

router.get(
  "/api/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

router.get(
  "/api/auth/google/redirect",
  passport.authenticate("google", { scope: ["profile"] }),
  (request, response) => {
    response.sendStatus(200);
  }
);

export default router;
