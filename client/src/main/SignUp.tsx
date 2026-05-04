import { useState } from "react";
import { TextField, Button } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "src/auth/AuthContext";

export default function SignUp() {
	const [form, setForm] = useState({
		name: "",
		username: "",
		password: "",
	});
	const navigate = useNavigate();
	const { register } = useAuth(); // ✅ use context

	const handleSubmit = async () => {
		try {
			await register(form); // ✅ no axios
			navigate("/"); // auto login
		} catch {
			// ❌ no alert (handled globally)
		}
	};

	return (
		<div className="space-y-4">
			<h2 className="text-xl font-semibold text-center">Create Account</h2>

			<TextField
				label="Name"
				required
				fullWidth
				onChange={(e) => setForm({ ...form, name: e.target.value })}
			/>
			<TextField
				label="Username"
				required
				fullWidth
				onChange={(e) => setForm({ ...form, username: e.target.value })}
			/>

			<TextField
				label="Password"
				type="password"
				required
				fullWidth
				onChange={(e) => setForm({ ...form, password: e.target.value })}
			/>

			<Button variant="contained" fullWidth onClick={handleSubmit}>
				Register
			</Button>

			<p className="text-sm text-center">
				Already have an account?{" "}
				<Link to="/login" className="text-blue-500">
					Login
				</Link>
			</p>
		</div>
	);
}
