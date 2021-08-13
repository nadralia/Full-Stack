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

const sellerAuth = (req, res, next) => {
  const { isSeller } = req.user;

  if (!isSeller) {
    res.status(401).json({ message: "You aren't a seller" });
  } else next();
};

const adminAuth = (req, res, next) => {
  const { isAdmin } = req.user;

  if (!isAdmin) {
    res.status(401).json({ message: "Authorization denied, only Admins" });
  } else next();
};


const shipperAuth = (req, res, next) => {
  const { isShipper } = req.user;

  if (!isShipper) {
    res.status(401).json({ message: "Ooooof, ship" });
  } else next();
};

module.exports = { auth, sellerAuth, adminAuth, shipperAuth };
