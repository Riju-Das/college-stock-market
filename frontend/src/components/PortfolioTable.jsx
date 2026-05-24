const formatMoney = (value) =>
    Number(value).toLocaleString("en-US", {
        style: "currency",
        currency: "USD"
    });

const formatPercent = (value) => {
    const number = Number(value);
    const sign = number >= 0 ? "+" : "";
    return `${sign}${number.toFixed(2)}%`;
};

export default function PortfolioTable({ holdings }) {
    if (!holdings || holdings.length === 0) {
        return <div className="empty-state">No holdings yet.</div>;
    }

    return (
        <table className="data-table">
            <thead>
                <tr>
                    <th>Symbol</th>
                    <th>Quantity</th>
                    <th>Avg Price</th>
                    <th>Market Price</th>
                    <th>Value</th>
                    <th>Change</th>
                </tr>
            </thead>
            <tbody>
                {holdings.map((holding) => (
                    <tr key={holding.stock_id}>
                        <td>{holding.symbol}</td>
                        <td>{holding.quantity}</td>
                        <td>{formatMoney(holding.avg_price)}</td>
                        <td>{formatMoney(holding.price)}</td>
                        <td>{formatMoney(holding.value)}</td>
                        <td>
                            <span
                                className={`chip ${Number(holding.change_percent) >= 0 ? "positive" : "negative"}`}
                            >
                                {formatPercent(holding.change_percent)}
                            </span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
