import express from "express";
import {
  signup,
  login,
  logout,
  verifyEmail,
  forgotPassword,
} from "../controllers/auth.controller.js";

const router = express.Router();

// this handles the different routing to different pages
// localhost:3000/api/auth/{route} where route is signup, login, logout, etc and routes to that page
// the variables signup, login, and logout are declared in auth.controllers.js
router.post("/signup", signup); // needs to be set to "post" so that postman will work
router.post("/login", login);
router.post("/logout", logout);

router.post("/verify-email", verifyEmail);

router.post("/forgot-password", forgotPassword);

export default router;
