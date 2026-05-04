import { Outlet } from "react-router-dom";
import { Paper } from "@mui/material";

export default function AuthLayout() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			<Paper className="p-8 w-[400px] space-y-4 shadow-lg">
				<h1 className="text-2xl font-bold text-center">Library System</h1>

				<Outlet />
			</Paper>
		</div>
	);
}
