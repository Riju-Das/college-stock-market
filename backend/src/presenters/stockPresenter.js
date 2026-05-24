const stockModel = require("../models/stockModel");

const listStocks = async () => {
    const stocks = await stockModel.getAll();
    return stocks;
};

module.exports = { listStocks };
