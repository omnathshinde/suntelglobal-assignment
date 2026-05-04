import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Button,
} from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

type BookFormProps = {
	open: boolean;
	onClose: () => void;
	onSubmit: (data: any) => void;
	initialData?: any;
};

export default function BookForm({
	open,
	onClose,
	onSubmit,
	initialData,
}: BookFormProps) {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm({
		defaultValues: {
			title: "",
			author: "",
			publishedYear: "",
		},
	});

	// ✅ Prefill for update
	useEffect(() => {
		if (initialData) {
			reset(initialData);
		} else {
			reset({
				title: "",
				author: "",
				publishedYear: "",
			});
		}
	}, [initialData, reset]);

	const submitHandler = (data: any) => {
		onSubmit({
			...data,
			publishedYear: Number(data.publishedYear),
		});
		onClose();
	};

	return (
		<Dialog open={open} onClose={onClose} fullWidth>
			<DialogTitle>{initialData ? "Update Book" : "Create Book"}</DialogTitle>

			<form onSubmit={handleSubmit(submitHandler)}>
				<DialogContent>
					{/* Title */}
					<TextField
						label="Title"
						fullWidth
						margin="dense"
						{...register("title", {
							required: "Title is required",
							minLength: {
								value: 3,
								message: "Min 3 characters",
							},
						})}
						error={!!errors.title}
						helperText={errors.title?.message as string}
					/>

					{/* Author */}
					<TextField
						label="Author"
						fullWidth
						margin="dense"
						{...register("author", {
							required: "Author is required",
						})}
						error={!!errors.author}
						helperText={errors.author?.message as string}
					/>

					{/* Year */}
					<TextField
						label="Published Year"
						type="number"
						fullWidth
						margin="dense"
						{...register("publishedYear", {
							required: "Year is required",
							min: {
								value: 1000,
								message: "Invalid year",
							},
							max: {
								value: new Date().getFullYear(),
								message: "Future year not allowed",
							},
						})}
						error={!!errors.publishedYear}
						helperText={errors.publishedYear?.message as string}
					/>
				</DialogContent>

				<DialogActions>
					<Button onClick={onClose}>Cancel</Button>

					<Button type="submit" variant="contained" disabled={isSubmitting}>
						{isSubmitting ? "Saving..." : initialData ? "Update" : "Create"}
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
}
