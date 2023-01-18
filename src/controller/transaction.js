const transactionRepo = require("../repo/transaction");
const sendResponse = require("../helper/sendResponse");

const postbooking = async (req, res) => {
  try {
    const response = await transactionRepo.postBooking(
      req.body,
      req.userPayload.user_id
    );
    sendResponse.success(res, response.status, response);
  } catch (error) {
    sendResponse.error(res, error.status, error);
  }
};

const payment = async (req, res) => {
  try {
    const response = await transactionRepo.payment(
      req.body,
      req.file.secure_url
    );
    sendResponse.success(res, response.status, response);
  } catch (error) {
    sendResponse.error(res, error.status, error);
  }
};
const getByStatus = async (req, res) => {
  try {
    const response = await transactionRepo.getTransactionsByStatus_booking(
      req.body.status,
      req.userPayload.user_id
    );
    sendResponse.success(res, response.status, response);
  } catch (error) {
    sendResponse.error(res, error.status, error);
  }
};
const getHistory = async (req, res) => {
  try {
    const response = await transactionRepo.getHistoryCustomer(
      req.params.status,
      req.userPayload.user_id
    );
    sendResponse.success(res, response.status, response);
  } catch (error) {
    sendResponse.error(res, error.status, error);
  }
};
const getStatusProcess = async (req, res) => {
  try {
    const response = await transactionRepo.getStatusProcess(
      req.userPayload.user_id
    );
    sendResponse.success(res, response.status, response);
  } catch (error) {
    sendResponse.error(res, error.status, error);
  }
};
const getStatuspaid = async (req, res) => {
  try {
    const response = await transactionRepo.getStatusPaid(
      req.userPayload.user_id
    );
    sendResponse.success(res, response.status, response);
  } catch (error) {
    sendResponse.error(res, error.status, error);
  }
};
const acceptOrder = async (req, res) => {
  try {
    const response = await transactionRepo.acceptOrder(req.params.id);
    sendResponse.success(res, response.status, response);
  } catch (error) {
    sendResponse.error(res, error.status, error);
  }
};
const cancelOrder = async (req, res) => {
  try {
    const response = await transactionRepo.cancelOrder(req.params.id);
    sendResponse.success(res, response.status, response);
  } catch (error) {
    sendResponse.error(res, error.status, error);
  }
};
const finishOrder = async (req, res) => {
  try {
    const response = await transactionRepo.finishOrder(req.params.id);
    sendResponse.success(res, response.status, response);
  } catch (error) {
    sendResponse.error(res, error.status, error);
  }
};
const deleteOwner = async (req, res) => {
  try {
    const response = await transactionRepo.deleteTransactionOwner(
      req.params.id
    );
    sendResponse.success(res, response.status, response);
  } catch (error) {
    sendResponse.error(res, error.status, error);
  }
};
const deleteCustomer = async (req, res) => {
  try {
    const response = await transactionRepo.deleteTransactionCustomer(
      req.params.id
    );
    sendResponse.success(res, response.status, response);
  } catch (error) {
    sendResponse.error(res, error.status, error);
  }
};

const kontrakanController = {
  postbooking,
  payment,
  getByStatus,
  getStatusProcess,
  getStatuspaid,
  getHistory,
  acceptOrder,
  cancelOrder,
  finishOrder,
  deleteCustomer,
  deleteOwner,
};

module.exports = kontrakanController;
