import express from "express";
import {
  signup,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  checkAuthentication,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// checks if a user is logged in/authenticated by verifying token
router.get("/check-authentication", verifyToken, checkAuthentication);

// this handles the different routing to different pages
// localhost:3000/api/auth/{route} where route is signup, login, logout, etc and routes to that page
// the variables signup, login, and logout are declared in auth.controllers.js
router.post("/signup", signup); // needs to be set to "post" so that postman will work
router.post("/login", login);
router.post("/logout", logout);

router.post("/verify-email", verifyEmail);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword); // need colon since it's dynamic

export default router;
