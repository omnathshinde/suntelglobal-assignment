import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "src/auth/AuthContext";
import { Button } from "@mui/material";

export default function HomeLayout() {
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	const isAdmin = user?.role === "admin";

	const navItems = [
		{ label: "Profile", path: "/" },
		{ label: "Books", path: "/books" },
		...(isAdmin ? [{ label: "Users", path: "/users" }] : []),
		{ label: "Borrow History", path: "/borrow-history" },
	];

	return (
		<div className="min-h-screen flex">
			{/* 🧭 Sidebar */}
			<div className="w-64 bg-gray-900 text-white flex flex-col">
				<h2 className="text-xl font-bold p-4 border-b border-gray-700">📚 Library</h2>

				<div className="flex-1">
					{navItems.map((item) => (
						<div
							key={item.path}
							onClick={() => navigate(item.path)}
							className={`px-4 py-3 cursor-pointer hover:bg-gray-700 ${
								location.pathname === item.path ? "bg-gray-700" : ""
							}`}
						>
							{item.label}
						</div>
					))}
				</div>

				{/* Logout */}
				<div className="p-4 border-t border-gray-700">
					<Button fullWidth variant="contained" color="error" onClick={logout}>
						Logout
					</Button>
				</div>
			</div>

			{/* 📦 Main Content */}
			<div className="flex-1 bg-gray-50">
				{/* Top Bar */}
				<div className="flex justify-between items-center px-6 py-3 bg-white shadow">
					<h1 className="text-lg font-semibold">Welcome, {user?.name}</h1>
					<span className="text-sm text-gray-500">Role: {user?.role}</span>
				</div>

				{/* Page Content */}
				<div className="p-6">
					<Outlet />
				</div>
			</div>
		</div>
	);
}
