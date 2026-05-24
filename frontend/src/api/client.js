const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";
const TOKEN_KEY = "access_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY) || "";

export const setToken = (token) => {
    localStorage.setItem(TOKEN_KEY, token);
};

export const clearToken = () => {
    localStorage.removeItem(TOKEN_KEY);
};

const request = async (path, { method = "GET", body, auth = true } = {}) => {
    const headers = { "Content-Type": "application/json" };
    if (auth) {
        const token = getToken();
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }
    }

    const response = await fetch(`${API_BASE}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        const message = data.message || "Request failed";
        throw new Error(message);
    }

    return data;
};

export const login = async (payload) => {
    const data = await request("/auth/login", {
        method: "POST",
        body: payload,
        auth: false
    });
    setToken(data.token);
    return data;
};

export const register = async (payload) => {
    const data = await request("/auth/register", {
        method: "POST",
        body: payload,
        auth: false
    });
    setToken(data.token);
    return data;
};

export const getStocks = () => request("/stocks", { auth: false });
export const getMarketAnalysis = () => request("/market/analysis", { auth: false });
export const getPortfolio = () => request("/portfolio");

export const buyStock = (stockId, quantity) =>
    request("/portfolio/buy", {
        method: "POST",
        body: { stockId, quantity }
    });

export const sellStock = (stockId, quantity) =>
    request("/portfolio/sell", {
        method: "POST",
        body: { stockId, quantity }
    });

export const getTransactions = () => request("/transactions");
