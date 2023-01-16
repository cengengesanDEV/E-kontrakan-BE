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
      return res.status(400).json({ msg: "Size to large" });
    } else if (err) {
      console.log(err)
      return res.status(400).json({ msg: "Format Wrong" });
    }
    next();
  });
}

const { register , profile , deleteProfile , getDataById , getAllUser , unsuspend} = require("../controller/users.js");

usersRouter.post("/",validate.body("email", "passwords", "phone_number", "role"),register);
usersRouter.patch("/profile",isLogin(),validate.body("full_name","image","location","address","gender"),uploadFile,cloudinaryUploader,profile);
usersRouter.patch("/delete/:id",isLogin(),allowedRole('admin'),deleteProfile);
usersRouter.get("/",isLogin(),getDataById)
usersRouter.get('/search',getAllUser)
usersRouter.patch('/unsuspend/:id',isLogin(),allowedRole('admin'),unsuspend)

module.exports = usersRouter;
