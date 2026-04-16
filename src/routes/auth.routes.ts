import express, {Router} from "express";

import * as authController from "../controllers/auth.controller";
import { validate } from "../middleware/validate.middleware";
import { registerSchema } from "../dto/auth.dto";
import { loginSchema } from "../dto/auth.dto";

const router: Router = express.Router();

router.post("/register",validate(registerSchema), authController.register);
router.post("/login",validate(loginSchema), authController.login);


export default router;