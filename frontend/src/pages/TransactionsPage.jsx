import { useEffect, useState } from "react";
import { getTransactions } from "../api/client";
import TransactionTable from "../components/TransactionTable";

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        const load = async () => {
            try {
                const data = await getTransactions();
                if (active) {
                    setTransactions(data);
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

    return (
        <>
            <div>
                <div className="page-title">Transactions</div>
                <p className="subtle">Recent buy and sell activity.</p>
            </div>
            {error ? <div className="alert">{error}</div> : null}
            <div className="panel">
                <TransactionTable transactions={transactions} />
            </div>
        </>
    );
}
