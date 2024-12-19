import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  // when user is not logged in
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
  }

  try {
    // verifies user is logged in, gets user info, ensures token is valid
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.log("Error in verifyToken", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
