import axios from "axios";

export const AuthService = {
	login: async (payload: { username: string; password: string }) => {
		const res = await axios.post("/auth/login", payload);
		return res.data; // { user, token }
	},

	register: async (payload: { username: string; password: string }) => {
		const res = await axios.post("/auth/register", payload);
		return res.data;
	},

	setAuth: (data: { token: string; user: any }) => {
		sessionStorage.setItem("token", data.token);
		sessionStorage.setItem("user", JSON.stringify(data.user));
	},

	getToken: () => sessionStorage.getItem("token"),

	getUser: () => {
		const user = sessionStorage.getItem("user");
		return user ? JSON.parse(user) : null;
	},

	logout: () => {
		sessionStorage.clear();
	},
};
