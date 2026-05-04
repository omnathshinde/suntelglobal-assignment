export interface AuthUser {
	username: string;
	role: string;
	token: string;
}

export interface AuthContextType {
	isAuthenticated: boolean;
	token: string;
	user: AuthUser | null;
	login: (user: AuthUser) => void;
	logout: () => void;
}
