import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api/client";

export default function RegisterPage({ onAuth }) {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", email: "", password: "" });
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
            const data = await register(form);
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
            <div className="page-title">Create your account</div>
            <p className="subtle">Start tracking and managing your investments.</p>
            {error ? <div className="alert">{error}</div> : null}
            <form className="form" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                </div>
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
                    {loading ? "Creating..." : "Register"}
                </button>
            </form>
            <p className="subtle">
                Already have an account? <Link to="/login">Log in</Link>
            </p>
        </div>
    );
}
