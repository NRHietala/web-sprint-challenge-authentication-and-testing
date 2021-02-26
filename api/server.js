require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const { restricted } = require("./middleware/restricted");

const authRouter = require("./auth/auth-router.js");
const jokesRouter = require("./jokes/jokes-router.js");

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());

server.use("/api/auth", authRouter);
server.use("/api/jokes", restricted, jokesRouter);

server.get("/", (_, res) => {
  res.status(200).json("Your API is running, better go catch it!");
});
module.exports = server;
