import { RouterProvider } from "react-router-dom";
import rootRouter from "./routes/root.route";
import { ThemeProvider } from "./components/theme/ThemeProvider";

function App() {
	return (
		<ThemeProvider defaultTheme="light">
			<RouterProvider router={rootRouter} />
		</ThemeProvider>
	);
}

export default App;
