const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/secrets");

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
    department: user.department,
  };
  const options = {
    expiresIn: "1d",
  };
  return jwt.sign(payload, jwtSecret, options);
}

module.exports = generateToken;
