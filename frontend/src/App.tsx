import { ClerkProvider } from "@clerk/clerk-react";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { ThemeProvider } from "./components/theme/ThemeProvider";
import rootRouter from "./routes/root.route";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
	throw new Error("Missing Publishable Key");
}

function App() {
	return (
		<ClerkProvider publishableKey={PUBLISHABLE_KEY}>
			<ThemeProvider defaultTheme="light">
				<RouterProvider router={rootRouter} />
				<Toaster richColors position="top-right" />
			</ThemeProvider>
		</ClerkProvider>
	);
}

export default App;
