import express from "express";
import {profils} from "../controllers/index.js";
import {verifySessionJWT} from "../middlewares/index.js"
const router = express.Router();

router.get("/me",verifySessionJWT,profils.getProfilInformation)
router.put("/addInfos",verifySessionJWT,profils.setProfilInformation)

export default router;