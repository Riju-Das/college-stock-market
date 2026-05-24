import { NavLink } from "react-router-dom";

export default function AppHeader({ token, onLogout }) {
    return (
        <header className="app-header">
            <div className="brand">
                <div className="brand-mark">SM</div>
                <div>
                    <div className="brand-title">Stock Market</div>
                    <div className="brand-subtitle">Management System</div>
                </div>
            </div>
            <nav className="nav">
                {token ? (
                    <>
                        <NavLink to="/dashboard">Dashboard</NavLink>
                        <NavLink to="/portfolio">Portfolio</NavLink>
                        <NavLink to="/transactions">Transactions</NavLink>
                        <NavLink to="/market">Market</NavLink>
                        <button className="ghost-button" type="button" onClick={onLogout}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <NavLink to="/login">Login</NavLink>
                        <NavLink to="/register">Register</NavLink>
                    </>
                )}
            </nav>
        </header>
    );
}
