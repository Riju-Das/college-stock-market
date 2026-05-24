const portfolioPresenter = require("../presenters/portfolioPresenter");

const getPortfolio = async (req, res) => {
    try {
        const portfolio = await portfolioPresenter.getPortfolio(req.user.id);
        res.json(portfolio);
    } catch (err) {
        res.status(err.status || 500).json({
            message: err.message || "Unable to load portfolio"
        });
    }
};

const buyStock = async (req, res) => {
    try {
        const { stockId, quantity } = req.body;
        const portfolio = await portfolioPresenter.buy(req.user.id, stockId, quantity);
        res.json(portfolio);
    } catch (err) {
        res.status(err.status || 500).json({
            message: err.message || "Unable to buy stock"
        });
    }
};

const sellStock = async (req, res) => {
    try {
        const { stockId, quantity } = req.body;
        const portfolio = await portfolioPresenter.sell(req.user.id, stockId, quantity);
        res.json(portfolio);
    } catch (err) {
        res.status(err.status || 500).json({
            message: err.message || "Unable to sell stock"
        });
    }
};

module.exports = { getPortfolio, buyStock, sellStock };
