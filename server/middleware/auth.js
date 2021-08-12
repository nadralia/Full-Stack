const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;


const auth = (req, res, next) => {
  const token = req.header("x-auth-token");

  if (!token)
    return res.status(403).json({ message: "Authorization denied, please login" });

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    if (req.user.isRestricted) {
      res.status(401).json({ message: "Your account is banned, contact us" });
    } else next();
  } catch (e) {
    res.status(400).json({ message: "Please log in" });
  }
};



module.exports = { auth};
