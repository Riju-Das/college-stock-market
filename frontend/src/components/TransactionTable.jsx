const formatMoney = (value) =>
    Number(value).toLocaleString("en-US", {
        style: "currency",
        currency: "USD"
    });

export default function TransactionTable({ transactions }) {
    if (!transactions || transactions.length === 0) {
        return <div className="empty-state">No transactions yet.</div>;
    }

    return (
        <table className="data-table">
            <thead>
                <tr>
                    <th>Type</th>
                    <th>Symbol</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                {transactions.map((tx) => (
                    <tr key={tx.id}>
                        <td>{tx.type}</td>
                        <td>{tx.symbol}</td>
                        <td>{tx.quantity}</td>
                        <td>{formatMoney(tx.price)}</td>
                        <td>{formatMoney(tx.price * tx.quantity)}</td>
                        <td>{new Date(tx.created_at).toLocaleString()}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
