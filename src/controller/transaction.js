const transactionRepo = require("../repo/transaction");
const sendResponse = require("../helper/sendResponse");

const postbooking = async (req, res) => {
    try {
        console.log(req.body)
      const response = await transactionRepo.postBooking(req.body);
      sendResponse.success(res, response.status, response);
    } catch (error) {
      sendResponse.error(res, error.status, error);
    }
  };

const payment = async (req, res) => {
    try {
      console.log(req.body)
      const response = await transactionRepo.payment(req.body,req.file.secure_url);
      sendResponse.success(res, response.status, response);
    } catch (error) {
      sendResponse.error(res, error.status, error);
    }
  };

const kontrakanController = {
    postbooking,
    payment
  };
  
  module.exports = kontrakanController;