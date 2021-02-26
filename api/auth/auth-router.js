const router = require("express").Router();
const bcrypt = require("bcryptjs");

const User = require("../users/users-model");
const {
  isValid,
  validatePost,
  validateUser,
} = require("../middleware/restricted");
const generateToken = require("../../utils/generateToken");

router.post("/register", async (req, res, next) => {
  const credentials = req.body;
  try {
    if (credentials) {
      const rounds = process.env.BCRYPT_ROUNDS || 10;
      const hash = bcrypt.hashSync(credentials.password, rounds);
      credentials.password = hash;
      const newUser = await User.add(credentials);
      res.status(201).json(newUser);
    } else {
      res.status(400).json("username and password required");
    }
  } catch (error) {
    res.status(500).json("username taken");
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    if (isValid(req.body)) {
      const tryUser = await User.getBy({ username: username }).first();
      if (tryUser && bcrypt.compareSync(password, tryUser.password)) {
        const token = generateToken(tryUser);
        res
          .status(200)
          .json({ message: `Welcome Back ${tryUser.username}`, token });
      } else {
        res.status(401).json("username and password required");
      }
    }
  } catch (error) {
    res.status(500).json("invalid credentials");
  }
});

module.exports = router;
