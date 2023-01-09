const express = require("express");

const authRouter = require("./auth.js");
const userRouter = require("./users");
const kontrakanRouter = require("./kontrakan");

const mainRouter = express.Router();

const prefix = "/api";

mainRouter.use(`${prefix}/auth`, authRouter);
mainRouter.use(`${prefix}/users`, userRouter);
mainRouter.use(`${prefix}/kontrakan`, kontrakanRouter);

mainRouter.get("/", (req, res) => {
  res.json({
    msg: "Berjalan dengan baik",
  });
});

//export
module.exports = mainRouter;
