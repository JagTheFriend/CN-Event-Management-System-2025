import { RouterProvider } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import { Toaster } from "sonner";
import rootRouter from "./routes/root.route";
import { ThemeProvider } from "./components/theme/ThemeProvider";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
	throw new Error("Missing Publishable Key");
}

function App() {
	return (
		<ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
			<ThemeProvider defaultTheme="light">
				<RouterProvider router={rootRouter} />
				<Toaster richColors position="top-right" />
			</ThemeProvider>
		</ClerkProvider>
	);
}

export default App;
