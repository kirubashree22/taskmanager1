//  Import the JWT library
const jwt = require("jsonwebtoken");

//  Middleware function to authenticate users based on JWT token
const authMiddleware = (req, res, next) => {

  //  Step 1: Extract the token from the 'Authorization' header
  const token = req.header("Authorization")?.split(" ")[1];

  //  Step 2: If no token is provided, respond with 401 (Unauthorized)
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    //  Step 3: Verify the token using the secret key from environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //  Step 4: Attach the decoded user info to the request object
    req.user = decoded;

    // ⏭ Step 5: Call `next()` to continue to the next middleware/route handler
    next();

  } catch (err) {
    //  Step 6: If token is invalid or expired, return 403 (Forbidden)
    res.status(403).json({ message: "Invalid Token" });
  }
};

//  Export the middleware for use in route files
module.exports = authMiddleware;
