import express from "express";
import * as profils from "../controllers/profils.controller.js";
import verifySessionJWT from "../middlewares/verifySupabaseJWT.middleware.js"
const router = express.Router();

router.get("/profils/me",verifySessionJWT,profils.getProfilInformation)
router.put("/profils/addInfos",verifySessionJWT,profils.setProfilInformation)

export default router;