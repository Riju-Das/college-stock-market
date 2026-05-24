const stockPresenter = require("../presenters/stockPresenter");

const listStocks = async (req, res) => {
    try {
        const stocks = await stockPresenter.listStocks();
        res.json(stocks);
    } catch (err) {
        res.status(500).json({ message: "Unable to load stocks" });
    }
};

module.exports = { listStocks };
