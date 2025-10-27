import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import rootRouter from "./routes/root.route";
import { ThemeProvider } from "./components/theme/ThemeProvider";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
	throw new Error("Missing Publishable Key");
}

function App() {
	return (
		<ThemeProvider defaultTheme="light">
			<RouterProvider router={rootRouter} />
			<Toaster richColors position="top-right" />
		</ThemeProvider>
	);
}

export default App;
