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

export default function StockTable({ stocks }) {
    if (!stocks || stocks.length === 0) {
        return <div className="empty-state">No stocks available.</div>;
    }

    return (
        <table className="data-table">
            <thead>
                <tr>
                    <th>Symbol</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Change</th>
                </tr>
            </thead>
            <tbody>
                {stocks.map((stock) => (
                    <tr key={stock.id || stock.symbol}>
                        <td>{stock.symbol}</td>
                        <td>{stock.name}</td>
                        <td>{formatMoney(stock.price)}</td>
                        <td>
                            <span
                                className={`chip ${Number(stock.change_percent) >= 0 ? "positive" : "negative"}`}
                            >
                                {formatPercent(stock.change_percent)}
                            </span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
