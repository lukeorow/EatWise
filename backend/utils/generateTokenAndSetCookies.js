import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict", // csrf prevention
    maxAge: 7 * 24 * 60 * 60 * 1000, // lasts 7 days, change the first num to change day duration
  });

  return token;
};
