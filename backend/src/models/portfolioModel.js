const { all, get, run } = require("../db");

const getHoldings = (userId) =>
    all(
        "SELECT ph.id, ph.stock_id, ph.quantity, ph.avg_price, s.symbol, s.name, s.price, s.change_percent FROM portfolio_holdings ph JOIN stocks s ON s.id = ph.stock_id WHERE ph.user_id = ? ORDER BY s.symbol",
        [userId]
    );

const getHolding = (userId, stockId) =>
    get(
        "SELECT * FROM portfolio_holdings WHERE user_id = ? AND stock_id = ?",
        [userId, stockId]
    );

const createHolding = (userId, stockId, quantity, avgPrice) =>
    run(
        "INSERT INTO portfolio_holdings (user_id, stock_id, quantity, avg_price) VALUES (?, ?, ?, ?)",
        [userId, stockId, quantity, avgPrice]
    );

const updateHolding = (holdingId, quantity, avgPrice) =>
    run(
        "UPDATE portfolio_holdings SET quantity = ?, avg_price = ? WHERE id = ?",
        [quantity, avgPrice, holdingId]
    );

const deleteHolding = (holdingId) =>
    run("DELETE FROM portfolio_holdings WHERE id = ?", [holdingId]);

module.exports = {
    getHoldings,
    getHolding,
    createHolding,
    updateHolding,
    deleteHolding
};
