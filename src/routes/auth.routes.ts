import express, {Router} from "express";

import * as authController from "../controllers/auth.controller";
import { validate } from "../middleware/validate.middleware";
import { registerSchema } from "../dto/auth.dto";
import { loginSchema } from "../dto/auth.dto";

const router: Router = express.Router();

router.post("/register",validate(registerSchema), authController.register);
router.post("/login",validate(loginSchema), authController.login);
router.post("/refresh-token", authController.refreshToken);
router.post("/logout", authController.logout);
router.get("/verify-email", authController.verifyEmail);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

export default router;