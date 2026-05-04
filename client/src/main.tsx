import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./tailwind.scss";
import "./axios";
import { router } from "./routes.tsx";
import { AuthProvider } from "./auth/AuthContext.tsx";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ToastContainer hideProgressBar theme="colored" position="top-center" />
		<AuthProvider>
			<RouterProvider router={router} />
		</AuthProvider>
	</StrictMode>,
);

const splash = document.getElementById("splash");
if (splash) splash.remove();
