const kontrakanRepo = require("../repo/kontrakan");
const sendResponse = require("../helper/sendResponse");

const getAllCategory = async (req, res) => {
  try {
    const hostApi = `${req.protocol}://${req.hostname}`;
    const response = await kontrakanRepo.getAllCategory(req.query, hostApi);
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
    const { user_id } = req.userPayload;
    const response = await kontrakanRepo.postCategory(
      user_id,
      req.body,
      req.file.secure_url
    );
    sendResponse.success(res, response.status, response);
  } catch (error) {
    sendResponse.error(res, error.status, error);
  }
};

const postDetail = async (req, res) => {
  try {
    const response = await kontrakanRepo.postDetail(req);
    sendResponse.success(res, response.status, response);
  } catch (error) {
    sendResponse.error(res, error.status, error);
  }
};

const kontrakanController = {
  getAllCategory,
  getCategoryById,
  getDetailById,
  postCategory,
  postDetail
};

module.exports = kontrakanController;
