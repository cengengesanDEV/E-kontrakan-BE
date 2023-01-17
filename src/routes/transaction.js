const express = require("express");
const transactionRouter = express.Router();
const validate = require("../middleware/validate");
const isLogin = require("../middleware/isLogin.js");
const allowedRole = require("../middleware/allowedRole.js");

const {
    postbooking
  } = require("../controller/transaction");

transactionRouter.post('/',isLogin(),allowedRole('customer'),postbooking)

module.exports = transactionRouter;