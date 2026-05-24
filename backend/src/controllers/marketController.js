const marketPresenter = require("../presenters/marketPresenter");

const getAnalysis = async (req, res) => {
    try {
        const analysis = await marketPresenter.getAnalysis();
        res.json(analysis);
    } catch (err) {
        res.status(500).json({ message: "Unable to load market analysis" });
    }
};

module.exports = { getAnalysis };
