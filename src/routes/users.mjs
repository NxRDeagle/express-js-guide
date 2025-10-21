import { Router } from "express";
import { checkSchema, validationResult } from "express-validator";
import {
  createUserValidationSchema,
  getUsersValidationSchema,
} from "../utils/validationSchemas.mjs";
import { mockUsers } from "../utils/constants.mjs";
import { resolveIndexByUserId } from "../utils/middlewares.mjs";
import { createUserHandler, getUserByIdHandler } from "../handlers/users.mjs";

const router = Router();

router.get(
  "/api/users",
  checkSchema(getUsersValidationSchema),
  (request, response) => {
    console.log(request.session.id);
    request.sessionStore.get(request.session.id, (error, sessionData) => {
      if (error) {
        console.log(error);
        throw error;
      }
      console.log(sessionData);
    });

    const result = validationResult(request);
    console.log(result);
    const {
      query: { filter, value },
    } = request;
    if (filter && value) {
      const filterUsers = mockUsers.filter((user) =>
        user[filter].includes(value)
      );
      return response.send(filterUsers);
    }
    return response.send(mockUsers);
  }
);

router.get("/api/users/:id", resolveIndexByUserId, getUserByIdHandler);

router.post(
  "/api/users",
  checkSchema(createUserValidationSchema),
  createUserHandler
);

router.put("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { body, findUserIndex } = request;
  mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
  return response.sendStatus(200);
});

router.patch("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { body, findUserIndex } = request;
  const findUser = mockUsers[findUserIndex];
  mockUsers[findUserIndex] = { ...findUser, ...body };
  return response.sendStatus(200);
});

router.delete("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { findUserIndex } = request;
  mockUsers.splice(findUserIndex, 1);
  return response.sendStatus(200);
});

export default router;
