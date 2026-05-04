import {
	Box,
	TextField,
	Button,
	Typography,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	IconButton,
	Chip,
	CircularProgress,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";

import { useState } from "react";
import { useUsers } from "src/hooks/useUsers";
import Swal from "sweetalert2";

export default function Users() {
	const { users, total, loading, query, setQuery, deleteUser } = useUsers();

	// ✅ FIXED filter state
	const [filters, setFilters] = useState({
		name: "",
		username: "",
	});

	// ✅ Apply filter
	const applyFilters = () => {
		setQuery({
			...query,
			name: filters.name,
			username: filters.username,
			offset: 0,
		});
	};

	// ✅ Clear filter
	const clearFilters = () => {
		const reset = { name: "", username: "" };
		setFilters(reset);

		setQuery({
			...query,
			name: "",
			username: "",
			offset: 0,
		});
	};

	const totalPages = Math.ceil(total / query.limit) || 1;
	const currentPage = Math.floor(query.offset / query.limit) + 1;

	const handleDelete = async (user: any) => {
		if (user.role === "admin") return; // extra safety

		const result = await Swal.fire({
			title: "Are you sure?",
			text: `Do you really want to delete ${user.username}?`,
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#d33",
			cancelButtonColor: "#3085d6",
			confirmButtonText: "Yes, delete it!",
		});

		if (result.isConfirmed) {
			await deleteUser(user.id);

			Swal.fire({
				title: "Deleted!",
				text: "User has been deleted.",
				icon: "success",
				timer: 1500,
				showConfirmButton: false,
			});
		}
	};
	return (
		<Box p={4}>
			{/* Header */}
			<Typography variant="h4" gutterBottom>
				👥 Users
			</Typography>

			{/* 🔍 Filters */}
			<Paper sx={{ p: 2, mb: 3 }}>
				<Box display="flex" gap={2} alignItems="center">
					<TextField
						label="Name"
						size="small"
						value={filters.name}
						onChange={(e) => setFilters({ ...filters, name: e.target.value })}
					/>

					<TextField
						label="Username"
						size="small"
						value={filters.username}
						onChange={(e) =>
							setFilters({
								...filters,
								username: e.target.value,
							})
						}
					/>

					<Button variant="contained" onClick={applyFilters}>
						Search
					</Button>

					<Button variant="outlined" onClick={clearFilters}>
						Clear
					</Button>
				</Box>
			</Paper>

			{/* 📊 Table */}
			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>
								<b>Name</b>
							</TableCell>
							<TableCell>
								<b>Username</b>
							</TableCell>
							<TableCell>
								<b>Role</b>
							</TableCell>
							{/* <TableCell>
								<b>Actions</b>
							</TableCell> */}
						</TableRow>
					</TableHead>

					<TableBody>
						{loading ? (
							<TableRow>
								<TableCell colSpan={4} align="center">
									<CircularProgress size={24} />
								</TableCell>
							</TableRow>
						) : users.length > 0 ? (
							users.map((u: any) => (
								<TableRow key={u.id} hover>
									<TableCell>{u.name}</TableCell>
									<TableCell>{u.username}</TableCell>

									<TableCell>
										<Chip
											label={u.role}
											color={u.role === "admin" ? "primary" : "default"}
										/>
									</TableCell>

									{/* <TableCell>
										<IconButton
											color="error"
											onClick={() => handleDelete(u)}
											disabled={u.role === "admin"} // 🔐 protect admin
										>
											<DeleteIcon />
										</IconButton>
									</TableCell> */}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={4} align="center">
									No Users Found
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>

			{/* 📄 Pagination */}
			<Box mt={3} display="flex" justifyContent="space-between">
				<Button
					variant="outlined"
					onClick={() =>
						setQuery({
							...query,
							offset: Math.max(query.offset - query.limit, 0),
						})
					}
					disabled={query.offset === 0}
				>
					Prev
				</Button>

				<Typography>
					Page {currentPage} / {totalPages}
				</Typography>

				<Button
					variant="outlined"
					onClick={() =>
						setQuery({
							...query,
							offset: query.offset + query.limit,
						})
					}
					disabled={query.offset + query.limit >= total}
				>
					Next
				</Button>
			</Box>
		</Box>
	);
}
