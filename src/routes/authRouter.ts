import express from "express";
import { SignUp, login, refreshAccessToken } from "../controllers/authController";
import {validate} from "../middleware/validation";
import { signUpSchema, loginSchema } from "../validation/authSchema";

const router = express.Router();

router.post("/signup", validate(signUpSchema), SignUp);
router.post("/login", validate(loginSchema), login);
router.get("/refresh", refreshAccessToken);

export default router;
