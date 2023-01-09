const express = require("express");
const usersRouter = express.Router();
const validate = require("../middleware/validate");
const isLogin = require("../middleware/isLogin");
const allowedRole = require("../middleware/allowedRole.js");

const multer = require("multer");
const cloudinaryUploader = require("../middleware/cloudinaryProfile");
const { memoryUpload } = require("../middleware/upload");
function uploadFile(req, res, next) {
  memoryUpload.single("image")(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log(err);
      return res.status(400).json({ msg: err.message });
    } else if (err) {
      return res.json({ msg: err.message });
    }
    next();
  });
}

const { register,profile,deleteProfile } = require("../controller/users.js");

usersRouter.post("/",validate.body("email", "passwords", "phone_number", "role"),register);
usersRouter.patch("/profile",isLogin(),allowedRole("user"),uploadFile,cloudinaryUploader,validate.body("full_name","image"),profile);
usersRouter.patch("/delete/:id",isLogin(),deleteProfile)

module.exports = usersRouter;
