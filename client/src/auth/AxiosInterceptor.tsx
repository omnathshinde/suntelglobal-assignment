import axios from "axios";
import { AuthService } from "./AuthService";

axios.defaults.baseURL = import.meta.env.VITE_API_URL || "/";
axios.interceptors.request.use(
	(config) => {
		config.headers.Authorization = `JWT ${AuthService.getToken()}`;
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

axios.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			AuthService.logout();
		}
		return Promise.reject(error);
	},
);

axios.interceptors.response.use(
	(response) => response,
	(error) => {
		const status = error?.response?.status;

		// 🔐 Unauthorized → logout
		if (status === 401) {
			sessionStorage.clear();
			window.location.href = "/login";
		}

		// 🔥 Optional global toast
		console.error(error?.response?.data?.message || "API Error");

		return Promise.reject(error);
	},
);
