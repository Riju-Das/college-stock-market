import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/client";

export default function LoginPage({ onAuth }) {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            const data = await login(form);
            onAuth(data.token);
            navigate("/dashboard");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="panel">
            <div className="page-title">Welcome back</div>
            <p className="subtle">Log in to manage your portfolio and trades.</p>
            {error ? <div className="alert">{error}</div> : null}
            <form className="form" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button className="button" type="submit" disabled={loading}>
                    {loading ? "Signing in..." : "Login"}
                </button>
            </form>
            <p className="subtle">
                New here? <Link to="/register">Create an account</Link>
            </p>
        </div>
    );
}
