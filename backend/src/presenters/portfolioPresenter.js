const stockModel = require("../models/stockModel");
const portfolioModel = require("../models/portfolioModel");
const transactionModel = require("../models/transactionModel");

const formatNumber = (value) => Number(value.toFixed(2));

const enrichHoldings = (holdings) =>
    holdings.map((holding) => {
        const quantity = Number(holding.quantity);
        const price = Number(holding.price);
        const changePercent = Number(holding.change_percent);
        const value = quantity * price;
        const dailyChange = value * (changePercent / 100);

        return {
            ...holding,
            quantity,
            price,
            change_percent: changePercent,
            value: formatNumber(value),
            dailyChange: formatNumber(dailyChange)
        };
    });

const summarizeHoldings = (holdings) => {
    const totals = holdings.reduce(
        (acc, holding) => {
            acc.totalValue += holding.value;
            acc.dailyChange += holding.dailyChange;
            return acc;
        },
        { totalValue: 0, dailyChange: 0 }
    );

    const dailyChangePercent = totals.totalValue
        ? (totals.dailyChange / totals.totalValue) * 100
        : 0;

    return {
        totalValue: formatNumber(totals.totalValue),
        dailyChange: formatNumber(totals.dailyChange),
        dailyChangePercent: formatNumber(dailyChangePercent)
    };
};

const getPortfolio = async (userId) => {
    const rawHoldings = await portfolioModel.getHoldings(userId);
    const holdings = enrichHoldings(rawHoldings);
    const totals = summarizeHoldings(holdings);

    return { totals, holdings };
};

const buy = async (userId, stockId, quantity) => {
    const parsedStockId = Number(stockId);
    const parsedQuantity = Number(quantity);

    if (!Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
        throw { status: 400, message: "Quantity must be a positive integer" };
    }

    const stock = await stockModel.getById(parsedStockId);
    if (!stock) {
        throw { status: 404, message: "Stock not found" };
    }

    const existing = await portfolioModel.getHolding(userId, parsedStockId);
    if (existing) {
        const newQuantity = existing.quantity + parsedQuantity;
        const newAvgPrice =
            (existing.avg_price * existing.quantity + stock.price * parsedQuantity) /
            newQuantity;
        await portfolioModel.updateHolding(existing.id, newQuantity, newAvgPrice);
    } else {
        await portfolioModel.createHolding(userId, parsedStockId, parsedQuantity, stock.price);
    }

    await transactionModel.createTransaction(
        userId,
        parsedStockId,
        parsedQuantity,
        stock.price,
        "BUY"
    );

    return getPortfolio(userId);
};

const sell = async (userId, stockId, quantity) => {
    const parsedStockId = Number(stockId);
    const parsedQuantity = Number(quantity);

    if (!Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
        throw { status: 400, message: "Quantity must be a positive integer" };
    }

    const stock = await stockModel.getById(parsedStockId);
    if (!stock) {
        throw { status: 404, message: "Stock not found" };
    }

    const existing = await portfolioModel.getHolding(userId, parsedStockId);
    if (!existing || existing.quantity < parsedQuantity) {
        throw { status: 400, message: "Not enough shares to sell" };
    }

    const newQuantity = existing.quantity - parsedQuantity;
    if (newQuantity === 0) {
        await portfolioModel.deleteHolding(existing.id);
    } else {
        await portfolioModel.updateHolding(existing.id, newQuantity, existing.avg_price);
    }

    await transactionModel.createTransaction(
        userId,
        parsedStockId,
        parsedQuantity,
        stock.price,
        "SELL"
    );

    return getPortfolio(userId);
};

module.exports = { getPortfolio, buy, sell };
