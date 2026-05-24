import { useEffect, useState } from "react";
import { buyStock, getPortfolio, getStocks, sellStock } from "../api/client";
import PortfolioTable from "../components/PortfolioTable";

export default function PortfolioPage() {
    const [portfolio, setPortfolio] = useState(null);
    const [stocks, setStocks] = useState([]);
    const [form, setForm] = useState({ stockId: "", quantity: 1 });
    const [error, setError] = useState("");
    const [status, setStatus] = useState("");

    useEffect(() => {
        let active = true;

        const load = async () => {
            try {
                const [portfolioData, stocksData] = await Promise.all([
                    getPortfolio(),
                    getStocks()
                ]);
                if (!active) {
                    return;
                }
                setPortfolio(portfolioData);
                setStocks(stocksData);
                if (stocksData.length > 0) {
                    setForm((prev) => ({
                        ...prev,
                        stockId: prev.stockId || String(stocksData[0].id)
                    }));
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

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleTrade = async (type) => {
        setError("");
        setStatus("");

        if (!form.stockId) {
            setError("Select a stock first.");
            return;
        }

        try {
            const action = type === "buy" ? buyStock : sellStock;
            const updatedPortfolio = await action(form.stockId, Number(form.quantity));
            setPortfolio(updatedPortfolio);
            setStatus(type === "buy" ? "Purchase completed." : "Sale completed.");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <>
            <div>
                <div className="page-title">Portfolio</div>
                <p className="subtle">Track holdings and execute trades.</p>
            </div>
            <div className="panel">
                <PortfolioTable holdings={portfolio?.holdings || []} />
            </div>
            <div className="panel">
                <div className="page-title">Quick trade</div>
                <p className="subtle">Execute a buy or sell in seconds.</p>
                {error ? <div className="alert">{error}</div> : null}
                {status ? <div className="success">{status}</div> : null}
                <div className="form">
                    <div>
                        <label htmlFor="stockId">Stock</label>
                        <select
                            id="stockId"
                            name="stockId"
                            value={form.stockId}
                            onChange={handleChange}
                        >
                            {stocks.map((stock) => (
                                <option key={stock.id} value={stock.id}>
                                    {stock.symbol} - {stock.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="quantity">Quantity</label>
                        <input
                            id="quantity"
                            name="quantity"
                            type="number"
                            min="1"
                            step="1"
                            value={form.quantity}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="button-row">
                        <button className="button" type="button" onClick={() => handleTrade("buy")}>Buy</button>
                        <button
                            className="button secondary"
                            type="button"
                            onClick={() => handleTrade("sell")}
                        >
                            Sell
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
