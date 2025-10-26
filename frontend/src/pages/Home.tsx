import { Link } from "react-router-dom";
import { BackgroundLines } from "@/components/ui/background-lines";
import { Button } from "@/components/ui/button";

export default function Home() {
	return (
		<BackgroundLines className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
			<h2 className="dark:text-white text-2xl md:text-4xl font-bold text-center z-60">
				Welcome to CN Event Management System
			</h2>
			<p className="dark:text-white text-sm md:text-2xl max-w-xl mt-6 text-center z-60">
				Plan Less. Achieve More — with AI
			</p>
			<div className="flex flex-col sm:flex-row items-center gap-4 mt-6 z-60">
				<Button asChild className="cursor-pointer">
					<Link to="/events">Browse Events &raquo;</Link>
				</Button>
			</div>
		</BackgroundLines>
	);
}
