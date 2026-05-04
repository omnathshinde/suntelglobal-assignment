import axios from "axios";
import { toast } from "react-toastify";
import { AuthService } from "./auth/AuthService";

axios.defaults.baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

axios.interceptors.request.use(
	(config) => {
		const token = AuthService.getToken();
		if (token) {
			config.headers.Authorization = `JWT ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

axios.interceptors.response.use(
	(response) => {
		return response;
	},

	(error) => {
		const message = error.response.data.message || "Something went wrong";
		toast.error(message);
		return Promise.reject(error);
	},
);
