const crypto = require("crypto");
const userModel = require("../models/userModel");

const generateToken = () => crypto.randomBytes(24).toString("hex");

const register = async ({ name, email, password }) => {
    if (!name || !email || !password) {
        throw { status: 400, message: "Name, email, and password are required" };
    }

    const existing = await userModel.findByEmail(email);
    if (existing) {
        throw { status: 409, message: "Email already registered" };
    }

    const token = generateToken();
    const user = await userModel.createUser(name, email, password, token);

    return {
        user: { id: user.id, name: user.name, email: user.email },
        token
    };
};

const login = async ({ email, password }) => {
    if (!email || !password) {
        throw { status: 400, message: "Email and password are required" };
    }

    const user = await userModel.findByEmail(email);
    if (!user || user.password !== password) {
        throw { status: 401, message: "Invalid credentials" };
    }

    const token = generateToken();
    await userModel.updateToken(user.id, token);

    return {
        user: { id: user.id, name: user.name, email: user.email },
        token
    };
};

module.exports = { register, login };
