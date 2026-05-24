const marketModel = require("../models/marketModel");

const getAnalysis = async () => {
    const [topMovers, topLosers, allStocks] = await Promise.all([
        marketModel.getTopMovers(),
        marketModel.getTopLosers(),
        marketModel.getAll()
    ]);

    const avgChangePercent = allStocks.length
        ? allStocks.reduce((sum, stock) => sum + Number(stock.change_percent), 0) /
        allStocks.length
        : 0;

    const marketStatus = avgChangePercent >= 0.5
        ? "Bullish"
        : avgChangePercent <= -0.5
            ? "Bearish"
            : "Steady";

    return {
        summary: {
            marketStatus,
            avgChangePercent: Number(avgChangePercent.toFixed(2)),
            topMover: topMovers[0] || null
        },
        topMovers,
        topLosers
    };
};

module.exports = { getAnalysis };
