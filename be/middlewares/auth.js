const jwt = require("jsonwebtoken");
const User = require("../models/User");

try {
  exports.isAuthenticated = async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({
        message: "please login first",
      });
    }
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded._id);
    next();
  };
} catch (error) {
  res.status(500).json({
    message: error.message,
  });
}

try {
  exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(401).json({
          message: "user is  allowed to access this resource",
        });
      }
      next();
    };
  };
} catch (error) {
  res.status(500).json({
    message: error.message,
  });
}
