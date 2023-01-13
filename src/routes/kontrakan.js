const express = require("express");
const kontrakanRouter = express.Router();
const validate = require("../middleware/validate");
const isLogin = require("../middleware/isLogin.js");
const allowedRole = require("../middleware/allowedRole.js");

const cloudinaryCategory = require("../middleware/cloudinaryCategory");
const multer = require("multer");
const { diskUpload, memoryUpload } = require("../middleware/upload");
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

const {
  getAllCategory,
  getCategoryById,
  getDetailById,
  postCategory,
} = require("../controller/kontrakan");

kontrakanRouter.get("/:province", validate.params("province"), getAllCategory);
kontrakanRouter.get("/category/:id", getCategoryById);
kontrakanRouter.get("/detail/:id", getDetailById);
kontrakanRouter.post("/category",isLogin(),allowedRole("owner"),uploadFile,cloudinaryCategory,postCategory);

module.exports = kontrakanRouter;
