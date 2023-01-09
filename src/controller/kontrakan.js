const kontrakanRepo = require("../repo/kontrakan");
const sendResponse = require("../helper/sendResponse");

const getAllCategory = async (req, res) => {
  try {
    const { province } = req.body;
    const response = await kontrakanRepo.getAllCategory(province);
    sendResponse.success(res, response.status, response);
  } catch (error) {
    sendResponse.error(res, error.status, error);
  }
};

const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await kontrakanRepo.getcategoryById(id);
    sendResponse.success(res, response.status, response);
  } catch (error) {
    sendResponse.error(res, error.status, error);
  }
};
const getDetailById = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await kontrakanRepo.getDetailById(id);
    sendResponse.success(res, response.status, response);
  } catch (error) {
    sendResponse.error(res, error.status, error);
  }
};

const postCategory = async (req, res) => {
  try {
    const { id } = req.userPayload;
    const response = await kontrakanRepo.postCategory(
      id,
      req.body,
      req.file.secure_url
    );
    sendResponse.success(res, response.status, response);
  } catch (error) {
    sendResponse.error(res, error.status, error);
  }
};

const kontrakanController = {
  getAllCategory,
  getCategoryById,
  getDetailById,
  postCategory
};

module.exports = kontrakanController;
