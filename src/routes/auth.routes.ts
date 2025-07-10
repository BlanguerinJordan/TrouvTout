import express from "express";
import {auth} from "../controllers/index.js";
import {verifySessionJWT} from "../middlewares/index.js"

const router = express.Router();

router.get("/me", verifySessionJWT,auth.meHandler);
router.post("/signup",auth.signupHandler);
router.get("/confirmsignup",auth.confirmSignUpHandler);
router.post("/finalizesignup", auth.confirmSignUpFinalizeHandler);
router.post("/login",auth.loginHandler);
router.post("/logout", auth.logoutHandler);
router.post("/forgetpassword", auth.forgotPasswordHandler);
router.post("/newpassword", auth.newPasswordHandler);
router.get("/confirm", auth.confirmRecoveryHandler);
router.delete("/deleteuser",verifySessionJWT, auth.deleteUserHandler);

export default router;
