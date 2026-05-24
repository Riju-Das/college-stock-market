const express = require("express");
const cors = require("cors");
const { initDb } = require("./db");
const authRoutes = require("./routes/authRoutes");
const stockRoutes = require("./routes/stockRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const marketRoutes = require("./routes/marketRoutes");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/stocks", stockRoutes);
app.use("/api/market", marketRoutes);
app.use("/api/portfolio", authMiddleware, portfolioRoutes);
app.use("/api/transactions", authMiddleware, transactionRoutes);

const PORT = process.env.PORT || 4000;

initDb()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Backend listening on ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Failed to start server", err);
        process.exit(1);
    });
