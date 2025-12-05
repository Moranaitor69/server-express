import { Router } from "express";
import { createUser, getAllUsers, getUserById } from "../controllers/users.controllers.js";

const router = Router();

// Crear usuario
router.post("/createUser", createUser);

// Obtener todos los usuarios
router.get("/", getAllUsers);

// Obtener usuario por id
router.get("/:id", getUserById);

export default router;
