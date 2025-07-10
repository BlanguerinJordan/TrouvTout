import express from "express";
import auth from "./auth.routes.js";
import ads from "./ads.routes.js";
import profils from "./profils.routes.js";

const router = express.Router();
router.use("/auth", auth);
router.use("/ads", ads);
router.use("/profils", profils);

export default router;
