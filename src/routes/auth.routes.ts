import express, {Router} from "express";

import * as authController from "../controllers/auth.controller";
import { validate } from "../middleware/validate.middleware";
import { registerSchema } from "../dto/auth.dto";

const router: Router = express.Router();

router.post("/register",validate(registerSchema), authController.register);

export default router;