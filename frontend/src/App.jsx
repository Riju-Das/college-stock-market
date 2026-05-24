import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { clearToken, getToken } from "./api/client";
import AppHeader from "./components/AppHeader";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import PortfolioPage from "./pages/PortfolioPage";
import TransactionsPage from "./pages/TransactionsPage";
import MarketPage from "./pages/MarketPage";

const RequireAuth = ({ token, children }) => {
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

export default function App() {
    const [token, setToken] = useState(() => getToken());

    const handleAuth = (newToken) => {
        setToken(newToken);
    };

    const handleLogout = () => {
        clearToken();
        setToken("");
    };

    return (
        <div className="app">
            <AppHeader token={token} onLogout={handleLogout} />
            <main className="content">
                <Routes>
                    <Route
                        path="/"
                        element={<Navigate to={token ? "/dashboard" : "/login"} replace />}
                    />
                    <Route path="/login" element={<LoginPage onAuth={handleAuth} />} />
                    <Route path="/register" element={<RegisterPage onAuth={handleAuth} />} />
                    <Route
                        path="/dashboard"
                        element={
                            <RequireAuth token={token}>
                                <DashboardPage />
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="/portfolio"
                        element={
                            <RequireAuth token={token}>
                                <PortfolioPage />
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="/transactions"
                        element={
                            <RequireAuth token={token}>
                                <TransactionsPage />
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="/market"
                        element={
                            <RequireAuth token={token}>
                                <MarketPage />
                            </RequireAuth>
                        }
                    />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>
        </div>
    );
}
