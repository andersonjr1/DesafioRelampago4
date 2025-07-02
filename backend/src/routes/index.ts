// src/routes/index.ts
import { Router } from "express";
import * as usersController from "../controllers/usersController";
import * as authController from "../controllers/authController";
import { authenticateToken } from "../middleware/authMiddleware";
import * as lobbyController from "../controllers/lobbyController";

const router = Router();

router.post("/auth/register", usersController.register);
router.post("/auth/login", authController.login);
router.post("/auth/logout", authenticateToken, authController.logout);
router.get("/session", authenticateToken, authController.checkLogin);
router.post("/lobby/rooms", lobbyController.createRoom);
router.post("/lobby/rooms/join", lobbyController.enterRoom);

export { router };
