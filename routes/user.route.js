import {
  deleteUser,
  getUser,
  updateUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/jwt.js";
import express from "express";

const router = express.Router();

router.delete("/:id", verifyToken, deleteUser);
router.get("/:id", verifyToken, getUser);
router.post("/:id", verifyToken, updateUser);

export default router;
