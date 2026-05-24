const { get, run } = require("../db");

const createUser = async (name, email, password, token) => {
    const result = await run(
        "INSERT INTO users (name, email, password, token) VALUES (?, ?, ?, ?)",
        [name, email, password, token]
    );

    return { id: result.lastID, name, email, token };
};

const findByEmail = (email) => get("SELECT * FROM users WHERE email = ?", [email]);

const findByToken = (token) =>
    get("SELECT id, name, email, token FROM users WHERE token = ?", [token]);

const updateToken = (userId, token) =>
    run("UPDATE users SET token = ? WHERE id = ?", [token, userId]);

module.exports = { createUser, findByEmail, findByToken, updateToken };
