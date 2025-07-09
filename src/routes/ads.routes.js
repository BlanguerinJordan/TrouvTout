import express from "express";
import {ads} from "../controllers/index.js";
import {verifySessionJWT,upload} from "../middlewares/index.js"
const router = express.Router();

router.get("/categories",ads.getCategories);
router.post("/createads",upload.single("image"),verifySessionJWT,ads.createAd)
router.get("/myads",verifySessionJWT,ads.myAds)
router.get("/all", ads.allAds);


export default router;
