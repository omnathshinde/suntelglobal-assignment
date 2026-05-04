import { createBrowserRouter } from "react-router-dom";
import GuestGuard from "./auth/GuestGuard";
import AuthLayout from "./layouts/AuthLayout";
import SignIn from "./main/SignIn";
import SignUp from "./main/SignUp";
import AuthGuard from "./auth/AuthGuard";
import HomeLayout from "./layouts/HomeLayout";
import Profile from "./pages/Profile";
import Books from "./pages/Books";
import Users from "./pages/Users";
import BorrowHistory from "./pages/BorrowHistory";

export const router = createBrowserRouter([
	{
		element: <GuestGuard />,
		children: [
			{
				element: <AuthLayout />,
				children: [
					{ path: "/login", element: <SignIn /> },
					{ path: "/register", element: <SignUp /> },
				],
			},
		],
	},

	{
		element: <AuthGuard />,
		children: [
			{
				element: <HomeLayout />,
				children: [
					{ path: "/", element: <Profile /> },
					{ path: "/books", element: <Books /> },
					{ path: "/users", element: <Users /> },
					{ path: "/borrow-history", element: <BorrowHistory /> },
				],
			},
		],
	},
]);
