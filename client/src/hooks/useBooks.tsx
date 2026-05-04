import axios from "axios";
import { useEffect, useState } from "react";

export const useBooks = () => {
	const [books, setBooks] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);
	const [total, setTotal] = useState(0);

	const [query, setQuery] = useState({
		limit: 5,
		offset: 0,
		title: "",
		author: "",
	});

	const fetchBooks = async () => {
		setLoading(true);
		try {
			const res = await axios.get("/books", { params: query });

			const data = res.data;

			setBooks(data.rows || []);
			setTotal(data.count || 0); // ✅ FIX
		} catch (err) {
			console.error(err);
			setBooks([]);
			setTotal(0);
		} finally {
			setLoading(false);
		}
	};

	const deleteBook = async (id: string) => {
		await axios.delete(`/books/${id}`);
		fetchBooks();
	};

	const updateBook = async (id: string, data: any) => {
		await axios.put(`/books/${id}`, data);
		fetchBooks();
	};

	const createBook = async (data: any) => {
		await axios.post("/books", data);
		fetchBooks();
	};

	useEffect(() => {
		fetchBooks();
	}, [query]);

	return {
		books,
		total,
		loading,
		query,
		setQuery,
		deleteBook,
		updateBook,
		createBook,
	};
};
