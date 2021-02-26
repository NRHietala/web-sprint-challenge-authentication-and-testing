const { jwtSecret } = require("../../config/secrets");
const jwt = require("jsonwebtoken");
const User = require("../users/users-model");

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

function isValid(user) {
  return Boolean(
    user.username && user.password && typeof user.password === "string"
  );
}

function validatePost(req, res, next) {
  if (!req.body.username || !req.body.passwor) {
    res.status(400).json("username and password required");
  } else {
    next();
  }
}

async function validateUser(req, res, next) {
  const { username } = req.body;
  const user = await User.getBy({ username });
  if (user) {
    res.status(400).json("username taken");
  } else {
    next();
  }
}

module.exports = {
  restricted,
  isValid,
  validatePost,
  validateUser,
};
