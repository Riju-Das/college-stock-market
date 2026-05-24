import { useEffect, useState } from "react";
import { getMarketAnalysis } from "../api/client";
import StatCard from "../components/StatCard";
import StockTable from "../components/StockTable";

const formatPercent = (value) => {
    const number = Number(value);
    if (!Number.isFinite(number)) {
        return "--";
    }
    const sign = number >= 0 ? "+" : "";
    return `${sign}${number.toFixed(2)}%`;
};

export default function MarketPage() {
    const [analysis, setAnalysis] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        const load = async () => {
            try {
                const data = await getMarketAnalysis();
                if (active) {
                    setAnalysis(data);
                }
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

    const summary = analysis?.summary;

    return (
        <>
            <div>
                <div className="page-title">Market Analysis</div>
                <p className="subtle">Trend highlights and movers.</p>
            </div>
            {error ? <div className="alert">{error}</div> : null}
            <div className="grid cards">
                <StatCard label="Market Status" value={summary?.marketStatus || "--"} />
                <StatCard
                    label="Average Change"
                    value={formatPercent(summary?.avgChangePercent)}
                />
                <StatCard
                    label="Top Mover"
                    value={summary?.topMover ? summary.topMover.symbol : "--"}
                    helper={summary?.topMover ? formatPercent(summary.topMover.change_percent) : ""}
                />
            </div>
            <div className="panel">
                <div className="page-title">Top Movers</div>
                <StockTable stocks={analysis?.topMovers || []} />
            </div>
            <div className="panel">
                <div className="page-title">Top Losers</div>
                <StockTable stocks={analysis?.topLosers || []} />
            </div>
        </>
    );
}
