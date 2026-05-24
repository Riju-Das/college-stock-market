import { useEffect, useState } from "react";
import { getMarketAnalysis, getPortfolio, getStocks } from "../api/client";
import StatCard from "../components/StatCard";
import StockTable from "../components/StockTable";

const formatMoney = (value) => {
    const number = Number(value);
    if (!Number.isFinite(number)) {
        return "--";
    }
    return number.toLocaleString("en-US", { style: "currency", currency: "USD" });
};

const formatPercent = (value) => {
    const number = Number(value);
    if (!Number.isFinite(number)) {
        return "--";
    }
    const sign = number >= 0 ? "+" : "";
    return `${sign}${number.toFixed(2)}%`;
};

export default function DashboardPage() {
    const [portfolio, setPortfolio] = useState(null);
    const [stocks, setStocks] = useState([]);
    const [analysis, setAnalysis] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        const load = async () => {
            try {
                const [portfolioData, stocksData, analysisData] = await Promise.all([
                    getPortfolio(),
                    getStocks(),
                    getMarketAnalysis()
                ]);
                if (!active) {
                    return;
                }
                setPortfolio(portfolioData);
                setStocks(stocksData);
                setAnalysis(analysisData);
            } catch (err) {
                if (active) {
                    setError(err.message);
                }
            }
        };

        load();
        return () => {
            active = false;
        };
    }, []);

    const totalValue = portfolio?.totals?.totalValue;
    const dailyChange = portfolio?.totals?.dailyChange;
    const dailyChangePercent = portfolio?.totals?.dailyChangePercent;
    const marketStatus = analysis?.summary?.marketStatus || "--";
    const topMover = analysis?.summary?.topMover;

    return (
        <>
            <div>
                <div className="page-title">Overview</div>
                <p className="subtle">Track your portfolio and market movement.</p>
            </div>
            {error ? <div className="alert">{error}</div> : null}
            <div className="grid cards">
                <StatCard label="Portfolio Value" value={formatMoney(totalValue)} />
                <StatCard
                    label="Daily Change"
                    value={formatMoney(dailyChange)}
                    helper={formatPercent(dailyChangePercent)}
                />
                <StatCard label="Market Status" value={marketStatus} />
                <StatCard
                    label="Top Mover"
                    value={topMover ? topMover.symbol : "--"}
                    helper={topMover ? formatPercent(topMover.change_percent) : ""}
                />
            </div>
            <div className="panel">
                <div className="page-title">Top Stocks</div>
                <p className="subtle">Live prices from the latest snapshot.</p>
                <StockTable stocks={stocks.slice(0, 6)} />
            </div>
        </>
    );
}
