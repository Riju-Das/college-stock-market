const authPresenter = require("../presenters/authPresenter");

const register = async (req, res) => {
    try {
        const result = await authPresenter.register(req.body);
        res.json(result);
    } catch (err) {
        res.status(err.status || 500).json({
            message: err.message || "Server error"
        });
    }
};

const login = async (req, res) => {
    try {
        const result = await authPresenter.login(req.body);
        res.json(result);
    } catch (err) {
        res.status(err.status || 500).json({
            message: err.message || "Server error"
        });
    }
};

module.exports = { register, login };
