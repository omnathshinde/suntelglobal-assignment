import { createContext, useContext, useState } from "react";
import { AuthService } from "./AuthService";

interface User {
	id: string;
	name: string;
	username: string;
	role: string;
}

interface AuthContextType {
	user: User | null;
	login: (data: any) => Promise<void>;
	register: (data: any) => Promise<void>;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: any) => {
	const [user, setUser] = useState<User | null>(
		JSON.parse(sessionStorage.getItem("user") || "null"),
	);

	const login = async (form: any) => {
		const data = await AuthService.login(form);
		AuthService.setAuth(data); // ✅ SINGLE SOURCE
		setUser(data.user);
	};

	const register = async (form: any) => {
		const data = await AuthService.register(form);

		AuthService.setAuth(data);
		setUser(data.user);
	};

	const logout = () => {
		AuthService.logout();
		setUser(null);
		window.location.href = "/login";
	};

	return (
		<AuthContext.Provider value={{ user, login, register, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("AuthContext missing");
	return ctx;
};
