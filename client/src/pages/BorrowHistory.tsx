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

import { useState } from "react";
import { useAuth } from "src/auth/AuthContext";

import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";

import Swal from "sweetalert2";
import { useBookBorrow } from "src/hooks/useBookBorrow";

export default function BorrowHistory() {
	const { transaction, query, setQuery, updateTransaction, total, loading } =
		useBookBorrow();

	const { user } = useAuth();
	const isAdmin = user?.role === "admin";

	const [filters, setFilters] = useState({ title: "", author: "", username: "" });

	const applyFilters = () => {
		setQuery({ ...query, ...filters, offset: 0 });
	};

	const clearFilters = () => {
		const reset = { title: "", author: "", username:"" };
		setFilters(reset);

		setQuery({
			...query,
			title: "",
			author: "",
			username: "",
			offset: 0,
		});
	};

	const totalPages = Math.ceil(total / query.limit) || 1;
	const currentPage = Math.floor(query.offset / query.limit) + 1;

	const handleReturn = async (transaction: any) => {
		const result = await Swal.fire({
			title: "Return Book?",
			text: `Are you sure "${transaction.book.title}" is returned?`,
			icon: "warning",
			showCancelButton: true,
			confirmButtonText: "Yes, Return",
		});

		if (result.isConfirmed) {
			await updateTransaction(transaction.id);

			Swal.fire({
				title: "Returned",
				text: "Book has been returned successfully",
				icon: "success",
				timer: 1500,
				showConfirmButton: false,
			});
		}
	};
	return (
		<Box p={4}>
			{/* Header */}
			<Box display="flex" justifyContent="space-between" mb={3}>
				<Typography variant="h4">📚 Borrow History</Typography>
			</Box>

			{/* Filters */}
			<Paper sx={{ p: 2, mb: 3 }}>
				<Box display="flex" gap={2}>
					<TextField
						label="Title"
						size="small"
						value={filters.title}
						onChange={(e) => setFilters({ ...filters, title: e.target.value })}
					/>

					<TextField
						label="Author"
						size="small"
						value={filters.author}
						onChange={(e) => setFilters({ ...filters, author: e.target.value })}
					/>

					<TextField
						label="Username"
						size="small"
						value={filters.username}
						onChange={(e) => setFilters({ ...filters, username: e.target.value })}
					/>

					<Button variant="outlined" onClick={applyFilters}>
						Search
					</Button>

					<Button variant="outlined" onClick={clearFilters}>
						Clear
					</Button>
				</Box>
			</Paper>

			{/* Table */}
			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>
								<b>Title</b>
							</TableCell>
							<TableCell>
								<b>Author</b>
							</TableCell>
							<TableCell>
								<b>Borrow By</b>
							</TableCell>
							<TableCell>
								<b>Status</b>
							</TableCell>
							<TableCell>
								<b>Borrow Date</b>
							</TableCell>
							<TableCell>
								<b>Return Date</b>
							</TableCell>
							{isAdmin && (
								<TableCell>
									<b>Actions</b>
								</TableCell>
							)}
						</TableRow>
					</TableHead>

					<TableBody>
						{loading ? (
							<TableRow>
								<TableCell colSpan={5} align="center">
									<CircularProgress size={24} />
								</TableCell>
							</TableRow>
						) : transaction.length > 0 ? (
							transaction.map((book: any) => (
								<TableRow key={book.id} hover>
									<TableCell>{book.book.title}</TableCell>
									<TableCell>{book.book.author}</TableCell>
									<TableCell>{book.user.username}</TableCell>

									<TableCell>
										<Chip
											label={book.status}
											color={book.status === "returned" ? "success" : "warning"}
										/>
									</TableCell>

									<TableCell>{book.createdAt || "-"}</TableCell>
									<TableCell>{book.returnDate || "-"}</TableCell>

									<TableCell>
										{isAdmin && book.status === "borrowed" && (
											<IconButton color="success" onClick={() => handleReturn(book)}>
												<AssignmentReturnIcon />
											</IconButton>
										)}
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={5} align="center">
									No Books Found
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>

			{/* Pagination */}
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
