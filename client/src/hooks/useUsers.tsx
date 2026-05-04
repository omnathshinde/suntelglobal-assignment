import axios from "axios";
import { useEffect, useState } from "react";

export const useUsers = () => {
	const [users, setUsers] = useState<any[]>([]);
	const [total, setTotal] = useState(0);
	const [loading, setLoading] = useState(false);

	const [query, setQuery] = useState({
		limit: 5,
		offset: 0,
		search: "",
	});

	const fetchUsers = async () => {
		setLoading(true);
		try {
			const res = await axios.get("/user", { params: query });

			const data = res.data;

			setUsers(data.rows || []);
			setTotal(data.count || 0);
		} catch (err) {
			console.error(err);
			setUsers([]);
			setTotal(0);
		} finally {
			setLoading(false);
		}
	};

	const deleteUser = async (id: string) => {
		await axios.delete(`/user/${id}`);
		fetchUsers();
	};

	useEffect(() => {
		fetchUsers();
	}, [query]);

	return {
		users,
		total,
		loading,
		query,
		setQuery,
		deleteUser,
	};
};
