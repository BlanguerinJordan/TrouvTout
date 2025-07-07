import express from "express";
import upload from "../middlewares/multerConfig.middleware.js"
import * as ads from "../controllers/ads.controller.js";
import verifySessionJWT from "../middlewares/verifySupabaseJWT.middleware.js"
const router = express.Router();

router.get("/categories",ads.getCategories);
router.post("/ads/createads",upload.single("image"),verifySessionJWT,ads.createAd)
router.get("/ads/myads",verifySessionJWT,ads.myAds)
router.get("/ads/all", ads.allAds);


export default router;
