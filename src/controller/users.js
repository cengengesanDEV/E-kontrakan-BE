const userRepo = require("../repo/users");
const sendResponse = require("../helper/sendResponse");

const register = async (req, res) => {
  try {
    const { body } = req;
    const response = await userRepo.register(body);
    sendResponse.success(res, response.status, response);
  } catch (error) {
    console.log(error)
    sendResponse.error(res, error.status, error);
  }
};

// profil
const profile = async (req, res) => {
  try {
    // push all body lalu if disini mengubah body.image menjadi file.patch
    // if (req.file) {
    //     req.body.image = `${req.file.filename}`;
    // }
    if (req.file) {
      var image = `/${req.file.public_id}.${req.file.format}`; //ubah filename
      req.body.image = req.file.secure_url;
    }

    const response = await userRepo.profile(req.body, req.userPayload.user_id);
    sendResponse.success(res, 200, {
      msg: "Edit Profile Success",
      data: response.rows,
      filename: image,
    });
  } catch (err) {
    console.log(err);
    sendResponse.error(res, 500, "internal server error");
  }
};

const deleteProfile = async (req, res) => {
  try {
      const response = await userRepo.deleteUsers(req.userPayload,req.params.id)
      sendResponse.success(res, response.status, response)

  } catch (error) {
      sendResponse.error(res, error.status, error)
  }
}

const userController = {
  register,
  profile,
  deleteProfile
};

module.exports = userController;
