import express from "express";
import * as profils from "../controllers/profils.controller.js";

const router = express.Router();

router.get("/profils/me",profils.getProfilInformation)
router.put("/profils/addInfos",profils.setProfilInformation)

export default router;