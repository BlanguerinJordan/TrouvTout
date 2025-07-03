import express from "express";
import * as auth from "../controllers/auth.controller.js";

const router = express.Router();

router.get("/me", auth.meHandler);
router.post("/auth/signup", auth.signupHandler);
router.get("/auth/confirmsignup", auth.confirmSignUpHandler);
router.post("/auth/finalizesignup", auth.confirmSignUpFinalizeHandler);
router.post("/auth/login", auth.loginHandler);
router.post("/auth/logout", auth.logoutHandler);
router.post("/auth/forgetpassword", auth.forgotPasswordHandler);
router.post("/auth/newpassword", auth.newPasswordHandler);
router.get("/auth/confirm", auth.confirmRecoveryHandler);
router.delete("/auth/deleteuser", auth.deleteUserHandler);

export default router;
