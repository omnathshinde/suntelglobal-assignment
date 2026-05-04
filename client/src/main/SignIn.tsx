import { useState } from "react";
import { TextField, Button } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "src/auth/AuthContext";

export default function SignIn() {
	const [form, setForm] = useState({ username: "", password: "" });
	const { login } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async () => {
		try {
			await login(form); // ✅ use context (no axios)
			navigate("/");
		} catch {
			// ❌ no alert (handled by interceptor)
		}
	};

	return (
		<div className="space-y-4">
			<h2 className="text-xl font-semibold text-center">Sign In</h2>

			<TextField
				label="Username"
				fullWidth
				onChange={(e) => setForm({ ...form, username: e.target.value })}
			/>

			<TextField
				label="Password"
				type="password"
				fullWidth
				onChange={(e) => setForm({ ...form, password: e.target.value })}
			/>

			<Button variant="contained" fullWidth onClick={handleSubmit}>
				Login
			</Button>

			<p className="text-sm text-center">
				New user?{" "}
				<Link to="/register" className="text-blue-500">
					Create account
				</Link>
			</p>
		</div>
	);
}
