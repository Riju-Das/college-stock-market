const { all, get } = require("../db");

const getAll = () =>
    all(
        "SELECT id, symbol, name, price, change_percent FROM stocks ORDER BY symbol"
    );

const getById = (id) =>
    get(
        "SELECT id, symbol, name, price, change_percent FROM stocks WHERE id = ?",
        [id]
    );

module.exports = { getAll, getById };
