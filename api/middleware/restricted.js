const { jwtSecret } = require("../../config/secrets");
const jwt = require("jsonwebtoken");

function restricted(req, res, next) {
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, jwtSecret, (error, decoded) => {
      if (error) {
        res.status(401).json("token invalid");
      } else {
        req.decodedJwt = decoded;
        next();
      }
    });
  } else {
    res.status(401).json("token required");
  }
}

module.exports = {
  restricted,
};
