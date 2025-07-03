import express from "express";
import upload from "../middlewares/multerConfig.middleware.js"
import * as ads from "../controllers/ads.controller.js";
const router = express.Router();

router.get("/categories", ads.getCategories);
router.post("/ads/createads",upload.single("image"),ads.createAd)
router.get("/ads/myads",ads.myAds)
router.get("/ads/all", ads.allAds);


export default router;
