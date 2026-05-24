const userModel = require("../models/userModel");

const authMiddleware = async (req, res, next) => {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
        res.status(401).json({ message: "Missing access token" });
        return;
    }

    try {
        const user = await userModel.findByToken(token);
        if (!user) {
            res.status(401).json({ message: "Invalid access token" });
            return;
        }
        req.user = user;
        next();
    } catch (err) {
        res.status(500).json({ message: "Auth validation failed" });
    }
};

module.exports = authMiddleware;
