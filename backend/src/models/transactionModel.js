const { all, run } = require("../db");

const createTransaction = (userId, stockId, quantity, price, type) =>
    run(
        "INSERT INTO transactions (user_id, stock_id, type, quantity, price) VALUES (?, ?, ?, ?, ?)",
        [userId, stockId, type, quantity, price]
    );

const listForUser = (userId) =>
    all(
        "SELECT t.id, t.type, t.quantity, t.price, t.created_at, s.symbol, s.name FROM transactions t JOIN stocks s ON s.id = t.stock_id WHERE t.user_id = ? ORDER BY t.created_at DESC LIMIT 25",
        [userId]
    );

module.exports = { createTransaction, listForUser };
