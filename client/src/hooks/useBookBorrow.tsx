import axios from "axios";
import { useEffect, useState } from "react";

export const useBookBorrow = () => {
	const [transaction, setTransaction] = useState<any[]>([]);
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
			const res = await axios.get("/books-borrow", { params: query });

			const data = res.data;

			setTransaction(data.rows || []);
			setTotal(data.count || 0); // ✅ FIX
		} catch (err) {
			console.error(err);
			setTransaction([]);
			setTotal(0);
		} finally {
			setLoading(false);
		}
	};

	const updateTransaction = async (id: string, data: any) => {
		await axios.put(`/books-borrow/${id}`, data);
		fetchBooks();
	};

	const createTransaction = async (data: any) => {
		await axios.post("/books-borrow", data);
		fetchBooks();
	};

	useEffect(() => {
		fetchBooks();
	}, [query]);

	return {
		transaction,
		total,
		loading,
		query,
		setQuery,
		updateTransaction,
		createTransaction,
	};
};
