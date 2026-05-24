const transactionModel = require("../models/transactionModel");

const listTransactions = async (userId) => {
    const transactions = await transactionModel.listForUser(userId);
    return transactions;
};

module.exports = { listTransactions };
