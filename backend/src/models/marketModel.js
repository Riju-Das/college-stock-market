const { all } = require("../db");

const getTopMovers = () =>
    all(
        "SELECT id, symbol, name, price, change_percent FROM stocks ORDER BY change_percent DESC LIMIT 5"
    );

const getTopLosers = () =>
    all(
        "SELECT id, symbol, name, price, change_percent FROM stocks ORDER BY change_percent ASC LIMIT 5"
    );

const getAll = () =>
    all("SELECT id, symbol, name, price, change_percent FROM stocks");

module.exports = { getTopMovers, getTopLosers, getAll };
