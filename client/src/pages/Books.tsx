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
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";

import { useState } from "react";
import { useAuth } from "src/auth/AuthContext";
import BookForm from "src/components/BookForm";
import { useBooks } from "src/hooks/useBooks";
import Swal from "sweetalert2";
import { useBookBorrow } from "src/hooks/useBookBorrow";

export default function Books() {
	const { books, query, setQuery, deleteBook, createBook, updateBook, total, loading } =
		useBooks();

	const { createTransaction } = useBookBorrow();

	const { user } = useAuth();
	const isAdmin = user?.role === "admin";

	const [filters, setFilters] = useState({ title: "", author: "" });

	const [open, setOpen] = useState(false);
	const [selectedBook, setSelectedBook] = useState<any>(null);

	const applyFilters = () => {
		setQuery({ ...query, ...filters, offset: 0 });
	};
	const clearFilters = () => {
		const reset = { title: "", author: "" };
		setFilters(reset);

		setQuery({
			...query,
			title: "",
			author: "",
			offset: 0,
		});
	};
	const totalPages = Math.ceil(total / query.limit) || 1;
	const currentPage = Math.floor(query.offset / query.limit) + 1;

	const handleDelete = async (book: any) => {
		const result = await Swal.fire({
			title: "Are you sure?",
			text: `Do you really want to delete ${book.title}?`,
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#d33",
			cancelButtonColor: "#3085d6",
			confirmButtonText: "Yes, delete it!",
		});

		if (result.isConfirmed) {
			await deleteBook(book.id);

			Swal.fire({
				title: "Deleted!",
				text: "Book has been deleted.",
				icon: "success",
				timer: 1500,
				showConfirmButton: false,
			});
		}
	};

	const handleBorrow = async (book: any) => {
		const result = await Swal.fire({
			title: "Are you sure?",
			text: `Do you really want to Borrow ${book.title}?`,
			icon: "warning",
			showCancelButton: true,
			confirmButtonText: "Yes, I want!",
		});

		if (result.isConfirmed) {
			await createTransaction({ bookId: book.id });
			applyFilters()
			Swal.fire({
				title: "Borrow",
				text: "Book has been borrow you.",
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
				<Typography variant="h4">📚 Books</Typography>

				{isAdmin && (
					<Button
						variant="contained"
						startIcon={<AddIcon />}
						onClick={() => {
							setSelectedBook(null);
							setOpen(true);
						}}
					>
						Add Book
					</Button>
				)}
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
								<b>Status</b>
							</TableCell>
							<TableCell>
								<b>Year</b>
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
						) : books.length > 0 ? (
							books.map((book: any) => (
								<TableRow key={book.id} hover>
									<TableCell>{book.title}</TableCell>
									<TableCell>{book.author}</TableCell>

									<TableCell>
										<Chip
											label={book.status}
											color={book.status === "available" ? "success" : "warning"}
										/>
									</TableCell>

									<TableCell>{book.publishedYear}</TableCell>

									{isAdmin && (
										<TableCell>
											<IconButton
												color="warning"
												onClick={() => {
													setSelectedBook(book);
													setOpen(true);
												}}
											>
												<EditIcon />
											</IconButton>

											<IconButton color="error" onClick={() => handleDelete(book)}>
												<DeleteIcon />
											</IconButton>
										</TableCell>
									)}
									{!isAdmin && book.status === "available" && (
										<TableCell>
											<IconButton color="primary" onClick={() => handleBorrow(book)}>
												<LibraryAddIcon />
											</IconButton>
										</TableCell>
									)}
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

			{/* Form */}
			<BookForm
				open={open}
				onClose={() => setOpen(false)}
				initialData={selectedBook}
				onSubmit={(data) => {
					selectedBook ? updateBook(selectedBook.id, data) : createBook(data);
				}}
			/>
		</Box>
	);
}
