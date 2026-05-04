import { Paper, Avatar, Divider } from "@mui/material";
import { useAuth } from "src/auth/AuthContext";

export default function Profile() {
	const { user } = useAuth();

	if (!user) return <div>Loading...</div>;

	return (
		<div className="flex justify-center">
			<Paper className="p-6 w-[400px] space-y-4 shadow">
				{/* Avatar + Name */}
				<div className="flex flex-col items-center gap-2">
					<Avatar sx={{ width: 70, height: 70 }}>{user.name?.[0]?.toUpperCase()}</Avatar>
					<h2 className="text-xl font-bold">{user.name}</h2>
					<p className="text-gray-500">@{user.username}</p>
				</div>

				<Divider />

				{/* Details */}
				<div className="space-y-2 text-sm">
					<div className="flex justify-between">
						<span className="font-medium text-gray-600">User ID</span>
						<span className="text-gray-800">{user.id}</span>
					</div>

					<div className="flex justify-between">
						<span className="font-medium text-gray-600">Username</span>
						<span className="text-gray-800">{user.username}</span>
					</div>

					<div className="flex justify-between">
						<span className="font-medium text-gray-600">Role</span>
						<span className="text-gray-800 capitalize">{user.role}</span>
					</div>
				</div>
			</Paper>
		</div>
	);
}
