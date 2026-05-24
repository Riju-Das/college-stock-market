const transactionPresenter = require("../presenters/transactionPresenter");

const listTransactions = async (req, res) => {
    try {
        const transactions = await transactionPresenter.listTransactions(req.user.id);
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ message: "Unable to load transactions" });
    }
};

module.exports = { listTransactions };
