import { BackgroundLines } from "@/components/ui/background-lines";
import { Link } from "react-router-dom";

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
          <Link
            to="/events"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 transition duration-200 rounded-lg text-white shadow-[0px_2px_0px_0px_#FFFFFF40_inset] focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Browse Events &raquo;
          </Link>
        </div>
    </BackgroundLines>
  );
}
