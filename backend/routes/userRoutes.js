import { Router } from "express";

export function createUserRouter(userController) {
    const router = Router();

    router.get("/users/:id", userController.getUserById.bind(userController));

    return router;
}