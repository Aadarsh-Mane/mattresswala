// this is auth
import jwt from "jsonwebtoken";
const SECRET = "MATRESS";

export const auth = (req, res, next) => {
  try {
    let token = req.headers.authorization;
    console.log("Authorization Header:", token || "Missing");

    if (token) {
      token = token.split(" ")[1];
      console.log("Bearer Token:", token);

      let user = jwt.verify(token, SECRET); // This line may throw an error
      console.log("Decoded User:", user);

      req.userId = user.userId;
      req.userType = user.userType;
      req.userName = user.userName;

      console.log("User Type:", req.usertype);
      console.log("User ID:", req.userId);
    } else {
      console.log("Token not provided.");
      return res.status(401).json({ message: "Unauthorized user" });
    }

    next(); // Ensure this is executed only when the token is valid
  } catch (error) {
    console.error("Auth Middleware Error:", error.message); // Log the error
    return res
      .status(401)
      .json({ message: "Unauthorized user", error: error.message });
  }
};
