import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookies.js";
import { sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/emails.js";

export const signup = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    if (!email || !password || !name) {
      throw new Error("All fields are required"); // gives us this error when trying post request
    }
    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // uses bcrypt to hash the inputted passwords
    const hashedPassword = await bcrypt.hash(password, 10);

    // creates email verification code (6 digit)
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const user = new User({
      email,
      password: hashedPassword,
      name,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // makes the token expire in 24 hours
    });

    await user.save(); // saves the user data into MongoDB

    generateTokenAndSetCookie(res, user._id);

    // sends an email with the verification token
    await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// verifies the new account with the 6 digit email token
export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() }, // makes sure token not expired yet
    });

    // if user with non expired verification token wasn't found
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Verification code is invalid or expired",
      });
    }

    // updates user db entry when verified, gets rid of verification token info
    user.isVerified = true;
    user.verificationToken = undefined; // deletes from the db
    user.verificationTokenExpiresAt = undefined;
    await user.save(); // saves user changes in the db

    await sendWelcomeEmail(user.email, user.name); // in emails.js

    res.status(200).json({
      success: true,
      message: "Email verified",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log("Error verifiying email ", error);
    res.status(500).json({ success: false, message: "Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid creds" });
    }
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect password" });
    }

    generateTokenAndSetCookie(res, user._id);

    user.lastLogin = new Date(); // sets the last logged in date to now
    await user.save();

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        ...user._doc,
        password: undefined, // doesn't display the pass
      },
    });
  } catch (error) {
    console.log("Error while logging in", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// clears the cookie to unauthenticate and log out the user
export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logout was successful" });
};
